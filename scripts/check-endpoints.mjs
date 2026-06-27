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
let requestCount = 0;

for (const filePath of listSourceFiles(sourceRoot)) {
  const sourceFile = readSourceFile(filePath);

  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(sourceFile) === 'axiosInstance'
    ) {
      const method = node.expression.name.text.toUpperCase();
      if (['GET', 'POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
        requestCount += 1;
        const position = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile)
        );
        const location = `${path.relative(projectRoot, filePath)}:${position.line + 1}`;
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

if (
  duplicates.length > 0 ||
  unresolvedRequests.length > 0 ||
  unmappedRequests.length > 0
) {
  process.exitCode = 1;
} else {
  console.log(
    `Endpoint access map check passed: ${endpoints.length} endpoints, ${requestCount} axios requests.`
  );
}
