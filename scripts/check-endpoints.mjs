import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, 'src');
const endpointMapPath = path.join(
  sourceRoot,
  'shared',
  'config',
  'endpointAccessMap.ts'
);

const readSourceFile = (filePath) => {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const scriptKind = filePath.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : ts.ScriptKind.TS;

  return ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );
};

const getPropertyName = (property, sourceFile) =>
  property.name && ts.isIdentifier(property.name)
    ? property.name.text
    : property.name?.getText(sourceFile);

const unwrapExpression = (expression) => {
  let current = expression;

  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression;
  }

  return current;
};

const readEndpointDefinitions = () => {
  const sourceFile = readSourceFile(endpointMapPath);
  let mapInitializer = null;

  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'endpointAccessMap' &&
      node.initializer
    ) {
      const initializer = unwrapExpression(node.initializer);
      if (ts.isObjectLiteralExpression(initializer)) {
        mapInitializer = initializer;
        return;
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  if (!mapInitializer) {
    throw new Error('endpointAccessMap declaration was not found');
  }

  return mapInitializer.properties.map((mapProperty) => {
    if (
      !ts.isPropertyAssignment(mapProperty) ||
      !ts.isCallExpression(mapProperty.initializer)
    ) {
      throw new Error(
        `Unsupported endpoint entry: ${mapProperty.getText(sourceFile)}`
      );
    }

    const definition = mapProperty.initializer.arguments[0];
    if (!definition || !ts.isObjectLiteralExpression(definition)) {
      throw new Error(
        `Endpoint definition must be an object: ${mapProperty.getText(sourceFile)}`
      );
    }

    const values = new Map();
    for (const property of definition.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      values.set(getPropertyName(property, sourceFile), property.initializer);
    }

    const methodNode = values.get('method');
    const pathNode = values.get('path');
    if (
      !methodNode ||
      !pathNode ||
      !ts.isStringLiteral(methodNode) ||
      !ts.isStringLiteral(pathNode)
    ) {
      throw new Error(
        `Endpoint method and path must be string literals: ${mapProperty.getText(sourceFile)}`
      );
    }

    return {
      key: getPropertyName(mapProperty, sourceFile),
      method: methodNode.text.toUpperCase(),
      path: pathNode.text,
    };
  });
};

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const compileEndpointPath = (endpointPath) => {
  const source = endpointPath
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment.startsWith(':') ? '[^/]+' : escapeRegExp(segment)
    )
    .join('/');

  return new RegExp(`^/${source}/?$`);
};

const getPathSpecificity = (endpointPath) => {
  const segments = endpointPath.split('/').filter(Boolean);
  const staticSegments = segments.filter(
    (segment) => !segment.startsWith(':')
  ).length;

  return staticSegments * 100 + segments.length;
};

const listSourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return listSourceFiles(entryPath);
    return /\.tsx?$/.test(entry.name) ? [entryPath] : [];
  });

const renderRequestUrl = (node, sourceFile) => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (!ts.isTemplateExpression(node)) return null;

  let result = node.head.text;
  for (const span of node.templateSpans) {
    result +=
      span.expression.getText(sourceFile) === 'BASE_URL'
        ? ''
        : '__param__';
    result += span.literal.text;
  }

  return result;
};

const endpoints = readEndpointDefinitions();
const duplicateKeys = new Map();

for (const endpoint of endpoints) {
  const signature = `${endpoint.method} ${endpoint.path}`;
  const keys = duplicateKeys.get(signature) ?? [];
  keys.push(endpoint.key);
  duplicateKeys.set(signature, keys);
}

const duplicates = [...duplicateKeys.entries()].filter(
  ([, keys]) => keys.length > 1
);
const compiledEndpoints = endpoints.map((endpoint) => ({
  ...endpoint,
  pattern: compileEndpointPath(endpoint.path),
  specificity: getPathSpecificity(endpoint.path),
}));
const unmappedRequests = [];
const unresolvedRequests = [];
const rtkEndpointIssues = [];
const axiosMisuses = [];
let requestCount = 0;
let rtkEndpointCount = 0;

const endpointKeys = new Set(endpoints.map((endpoint) => endpoint.key));

/** Builders of RTK Query that declare an endpoint. */
const rtkBuilderNames = new Set(['query', 'mutation', 'infiniteQuery']);

const axiosMethods = ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'];

/**
 * Generic axiosInstance calls (axiosInstance(...) or .request(...)) cannot be
 * resolved statically, so they are allowed only where the request layer itself
 * is declared: the instance and the RTK Query baseQuery.
 */
const axiosGenericUsageAllowlist = new Set([
  path.join(sourceRoot, 'shared', 'lib', 'axiosInstance.ts'),
  path.join(sourceRoot, 'shared', 'api', 'axiosBaseQuery.ts'),
]);

/** endpointAccessMap keys passed to request(...) inside a query builder. */
const inspectQueryBuilder = (node, sourceFile) => {
  const result = {
    keys: [],
    invalidKeys: [],
    hasRequestCall: false,
    literalUrl: false,
  };

  const walk = (current) => {
    if (
      ts.isCallExpression(current) &&
      ts.isIdentifier(current.expression) &&
      current.expression.text === 'request'
    ) {
      result.hasRequestCall = true;
      const target = current.arguments[0]
        ? unwrapExpression(current.arguments[0])
        : null;

      if (
        target &&
        ts.isPropertyAccessExpression(target) &&
        target.expression.getText(sourceFile) === 'endpointAccessMap'
      ) {
        const key = target.name.text;
        result.keys.push(key);
        if (!endpointKeys.has(key)) result.invalidKeys.push(key);
      } else {
        result.invalidKeys.push(
          target ? target.getText(sourceFile) : '<no argument>'
        );
      }
    }

    if (ts.isObjectLiteralExpression(current)) {
      for (const property of current.properties) {
        if (
          ts.isPropertyAssignment(property) &&
          getPropertyName(property, sourceFile) === 'url'
        ) {
          result.literalUrl = true;
        }
      }
    }

    ts.forEachChild(current, walk);
  };

  walk(node);

  return result;
};

for (const filePath of listSourceFiles(sourceRoot)) {
  const sourceFile = readSourceFile(filePath);

  const toLocation = (node) => {
    const position = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile)
    );

    return path.relative(projectRoot, filePath) + ':' + (position.line + 1);
  };

  const visit = (node) => {
    // An RTK Query endpoint must take its method and path from endpointAccessMap.
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      rtkBuilderNames.has(node.expression.name.text) &&
      node.arguments[0]
    ) {
      const config = unwrapExpression(node.arguments[0]);

      if (ts.isObjectLiteralExpression(config)) {
        const definition = new Map();
        for (const property of config.properties) {
          if (!ts.isPropertyAssignment(property)) continue;
          definition.set(
            getPropertyName(property, sourceFile),
            property.initializer
          );
        }

        if (definition.has('query') || definition.has('queryFn')) {
          rtkEndpointCount += 1;
          const location = toLocation(node);

          if (definition.has('queryFn')) {
            rtkEndpointIssues.push(
              location +
                ' queryFn bypasses the access map - declare the endpoint as query: request(endpointAccessMap.x)'
            );
          } else {
            const inspected = inspectQueryBuilder(
              definition.get('query'),
              sourceFile
            );

            if (inspected.literalUrl) {
              rtkEndpointIssues.push(
                location +
                  ' literal url in an endpoint - the path comes from endpointAccessMap via request()'
              );
            } else if (!inspected.hasRequestCall) {
              rtkEndpointIssues.push(
                location + ' query without request(endpointAccessMap.x)'
              );
            }

            for (const key of inspected.invalidKeys) {
              rtkEndpointIssues.push(
                location + ' request(' + key + ') is not an endpointAccessMap entry'
              );
            }
          }
        }
      }
    }

    // A generic axiosInstance call escapes the static check.
    if (
      ts.isIdentifier(node) &&
      node.text === 'axiosInstance' &&
      !axiosGenericUsageAllowlist.has(filePath)
    ) {
      const parent = node.parent;
      const isModuleBinding =
        parent &&
        (ts.isImportClause(parent) ||
          ts.isImportSpecifier(parent) ||
          ts.isNamespaceImport(parent) ||
          ts.isExportSpecifier(parent));

      if (!isModuleBinding) {
        if (
          parent &&
          ts.isPropertyAccessExpression(parent) &&
          parent.expression === node
        ) {
          if (!axiosMethods.includes(parent.name.text.toUpperCase())) {
            axiosMisuses.push(
              toLocation(node) +
                ' axiosInstance.' +
                parent.name.text +
                '(...) - checkable forms: ' +
                axiosMethods.map((method) => method.toLowerCase()).join(', ')
            );
          }
        } else {
          axiosMisuses.push(
            toLocation(node) +
              ' axiosInstance used directly - the URL is not statically resolvable'
          );
        }
      }
    }

    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(sourceFile) === 'axiosInstance'
    ) {
      const method = node.expression.name.text.toUpperCase();
      if (['GET', 'POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
        requestCount += 1;
        const location = toLocation(node);
        const requestUrl = node.arguments[0]
          ? renderRequestUrl(node.arguments[0], sourceFile)
          : null;

        if (!requestUrl) {
          unresolvedRequests.push(`${location} ${method} <dynamic URL>`);
        } else {
          const pathname = new URL(
            requestUrl,
            'http://endpoint-check.local'
          ).pathname;
          const matches = compiledEndpoints.filter(
            (endpoint) =>
              endpoint.method === method && endpoint.pattern.test(pathname)
          );
          const highestSpecificity = Math.max(
            ...matches.map((endpoint) => endpoint.specificity)
          );
          const resolvedMatches = matches.filter(
            (endpoint) => endpoint.specificity === highestSpecificity
          );

          if (resolvedMatches.length !== 1) {
            unmappedRequests.push(
              `${location} ${method} ${pathname} (matches: ${resolvedMatches.map((item) => item.key).join(', ') || 'none'})`
            );
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

if (duplicates.length > 0) {
  console.error('Duplicate endpoint definitions:');
  for (const [signature, keys] of duplicates) {
    console.error(`  ${signature}: ${keys.join(', ')}`);
  }
}

if (unresolvedRequests.length > 0) {
  console.error('Axios requests with statically unresolved URLs:');
  for (const request of unresolvedRequests) console.error(`  ${request}`);
}

if (unmappedRequests.length > 0) {
  console.error('Axios requests without exactly one endpoint match:');
  for (const request of unmappedRequests) console.error(`  ${request}`);
}

if (rtkEndpointIssues.length > 0) {
  console.error('RTK Query endpoints not bound to the endpoint access map:');
  for (const issue of rtkEndpointIssues) console.error(`  ${issue}`);
}

if (axiosMisuses.length > 0) {
  console.error('Unverifiable axiosInstance usage:');
  for (const misuse of axiosMisuses) console.error(`  ${misuse}`);
}

if (
  duplicates.length > 0 ||
  unresolvedRequests.length > 0 ||
  unmappedRequests.length > 0 ||
  rtkEndpointIssues.length > 0 ||
  axiosMisuses.length > 0
) {
  process.exitCode = 1;
} else {
  console.log(
    `Endpoint access map check passed: ${endpoints.length} endpoints, ${requestCount} axios requests, ${rtkEndpointCount} RTK Query endpoints.`
  );
}
