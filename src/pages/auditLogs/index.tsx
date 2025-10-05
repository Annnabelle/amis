import React, { useEffect, useState, useMemo, type JSX } from "react";
import {
  List,
  Badge,
  Space,
  Tag,
  Pagination,
  Card,
  Collapse,
  Tooltip,
} from "antd";
import {
  ClockCircleOutlined,
  GlobalOutlined,
  PlusOutlined,
  MinusOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ApartmentOutlined,
  TagOutlined,
} from "@ant-design/icons";
import MainLayout from "../../components/layout";
import Heading from "../../components/mainHeading";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchAuditLogs } from "../../store/auditLog";
import { ActionsMap, CategoryMap, TypeMap } from "./auditMappers";
import { Link } from "react-router-dom";
import { FormatUzbekPhoneNumber } from "../../utils/utils";
import { getTargetLink } from "./targetMapper";
import { FaArrowRightLong } from "react-icons/fa6";
import "./styles.sass";
import type { AuditCategory } from "../../dtos";

const { Panel } = Collapse;

const AuditLogsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { data, loading, page, total } = useAppSelector(
    (state) => state.auditLogs
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const supportedLangs = ['ru', 'en', 'uz'] as const;
  const dataLimit = useAppSelector((state) => state.auditLogs.limit)
  const dataPage = useAppSelector((state) => state.auditLogs.page)
  const dataTotal = useAppSelector((state) => state.auditLogs.total)

  useEffect(() => {
    dispatch(
      fetchAuditLogs({
        page: dataPage || 1,
        limit: dataLimit || 10,
        sortOrder: "desc",
        // type: "userRegistration",
      })
    );
  }, [dispatch, dataPage, dataLimit]);

 const logs = useMemo(() => {
  if (!data) return [];
  return data.map((log: any) => {
    const actor = log.actor || {};
    const target = log.target ;
    const messageObj = log.message || {};

    return {
      id: log.id,
      action: log.type,
      category: log.category || "-",
      actorType: log.actorType,
      firstName: actor.firstName || "",
      lastName: actor.lastName || "",
      requestId: log.requestId || "",
      correlationId: log.correlationId 
      || "",
      user: actor.firstName && actor.lastName
        ? `${actor.firstName} ${actor.lastName}`
        : "Неизвестно",
      email: actor.email || "",
      phone: actor.phone || "",
      status: actor.status || "",
      actorId: actor.id || "",
      lastLoggedInAt: actor.lastLoggedInAt
        ? new Date(actor.lastLoggedInAt).toLocaleString("ru-RU")
        : "",
      location: log.ip || "—",
      date: new Date(log.occurredAt).toLocaleDateString("ru-RU"),
      time: new Date(log.occurredAt).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      message: messageObj[i18n.language] || messageObj["en"] || "",
      targetEntity: log.targetEntity || "",
      target,
    };
  });
}, [data, i18n.language]);




  // const categoryColors: Record<string, string> = {
  //   user: "#FFF3E0",     
  //   auth: "#E0F7FA",   
  //   "-": "#F5F5F5",    
  //   company: "#F3E5F5",
  //   product: "#FFFDE7", 
  // };

  // const categoryBorders: Record<string, string> = {
  //   user: "#FF9800",
  //   auth: "#00BFA6",

  //   "-": "#BDBDBD",
  //   company: "#9C27B0",  
  //   product: "#FBC02D"
  // };

  const categoryColors: Record<string, string> = {
    user: "#3B2A1A",        // тёплый тёмно-коричневый, аналог светло-оранжевого (#FFF3E0)
    auth: "#103C43",        // глубокий бирюзово-синий, аналог #E0F7FA
    "-": "#2A2A2A",         // нейтрально-серый фон
    company: "#2E1A35",     // тёмно-фиолетовый, аналог #F3E5F5
    product: "#3A3620",     // тёмно-золотисто-коричневый, аналог #FFFDE7
  };

  const categoryBorders: Record<string, string> = {
    user: "#FFB74D",        // мягкий оранжевый (яркий контраст на тёмном фоне)
    auth: "#2fc5b6ff",        // свежий бирюзовый
    "-": "#757575",         // серый границы
    company: "#BA68C8",     // насыщенный фиолетовый
    product: "#FDD835",     // ярко-жёлтый акцент
  };


  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.category))).filter(
      (c) => c && c !== "-"
    );
  }, [logs]);

  

  const targetFieldMap: Record<string, { label: string; icon: JSX.Element }> = {
    // User
    fullName: { label: t('users.addUserForm.label.firstName'), icon: <UserOutlined style={{ color: "#1890ff" }} /> },
    lastName: { label: t('users.addUserForm.label.lastName'), icon: <UserOutlined style={{ color: "#1890ff" }} /> },
    email: { label: t('users.addUserForm.label.email'), icon: <MailOutlined style={{ color: "#13c2c2" }} /> },
    phone: { label: t('users.addUserForm.label.phone'), icon: <PhoneOutlined style={{ color: "#52c41a" }} /> },
    lastLoggedInAt: { label: t('users.addUserForm.label.lastLoggedInAt'), icon: <ClockCircleOutlined style={{ color: "#faad14" }} /> },
    // status: { label: "Статус", icon: <TagOutlined style={{ color: "#2f54eb" }} /> },

    // Company
    displayName: { label: t('organizations.addUserForm.label.displayName'), icon: <TagOutlined /> },
    legalName: { label: t('organizations.addUserForm.label.legalName'), icon: <TagOutlined /> },
    tin: { label: t('organizations.addUserForm.label.tin'), icon: <TagOutlined /> },
    director: { label: t('organizations.addUserForm.label.director'), icon: <UserOutlined /> },
    companyType: { label: t('organizations.addUserForm.label.companyType'), icon: <TagOutlined /> },
    productGroup: { label:t('organizations.addUserForm.label.productGroup'), icon: <TagOutlined /> },
    status: { label: t('organizations.addUserForm.label.status'), icon: <TagOutlined /> },
    deleted: { label: t('organizations.addUserForm.label.deleted'), icon: <TagOutlined /> },
    // deletedAt: { label: t('organizations.addUserForm.label.deletedAt'), icon: <ClockCircleOutlined /> },

    // Address
    "address.region": { label: t('organizations.addUserForm.label.region'), icon: <TagOutlined /> },
    "address.district": { label: t('organizations.addUserForm.label.district'), icon: <TagOutlined /> },
    "address.address": { label: t('organizations.addUserForm.label.address'), icon: <TagOutlined /> },

    // Bank details
    "bankDetails.bankName": { label: t('organizations.addUserForm.label.bankName'), icon: <TagOutlined /> },
    "bankDetails.ccea": { label: t('organizations.addUserForm.label.ccea'), icon: <TagOutlined /> },
    "bankDetails.account": { label: t('organizations.addUserForm.label.account'), icon: <TagOutlined /> },
    "bankDetails.mfo": { label: t('organizations.addUserForm.label.mfo'), icon: <TagOutlined /> },

    // Contacts
    "contacts.phone": { label: t('organizations.addUserForm.label.phone'), icon: <PhoneOutlined style={{ color: "#52c41a" }} /> },
    "contacts.email": { label: t('organizations.addUserForm.label.email'), icon: <MailOutlined style={{ color: "#13c2c2" }} /> },
    "contacts.url": { label: t('organizations.addUserForm.label.url'), icon: <GlobalOutlined /> },
    "contacts.person": { label: t('organizations.addUserForm.label.person'), icon: <UserOutlined /> },

    // Access codes
    "accessCodes.gcpCode": { label: t('organizations.addUserForm.label.gcpCode'), icon: <TagOutlined /> },
    "accessCodes.omsId": { label: t('organizations.addUserForm.label.omsId'), icon: <TagOutlined /> },
    "accessCodes.turonToken": { label: t('organizations.addUserForm.label.turonToken'), icon: <TagOutlined /> },
    // Product
    name: { label:  t('products.addProductForm.label.name'), icon: <TagOutlined /> },
    shortName: { label: t('products.addProductForm.label.shortName'), icon: <TagOutlined /> },
    description: { label: t('products.addProductForm.label.description'), icon: <TagOutlined /> },
    gtin: { label: t('products.addProductForm.label.gtin'), icon: <TagOutlined /> },
    barcode: { label: t('products.addProductForm.label.barcode'), icon: <TagOutlined /> },
    icps: { label: t('products.addProductForm.label.icps'), icon: <TagOutlined /> },
    productType: { label: t('products.addProductForm.label.productType'), icon: <TagOutlined /> },
    aggregationQuantity: { label: t('products.addProductForm.label.aggregationQuantity'), icon: <TagOutlined /> },
    expiration: { label: t('products.addProductForm.label.expiration'), icon: <ClockCircleOutlined /> },
    price: { label: t('products.addProductForm.label.price'), icon: <TagOutlined /> },
    companyId: { label:t('products.addProductForm.label.companyId'), icon: <ApartmentOutlined /> },
    "measurement.unit": { label:t('products.addProductForm.label.unit'), icon: <TagOutlined /> },
    "measurement.amount": { label: t('products.addProductForm.label.amount'), icon: <TagOutlined /> },

    // Weight
    "weight.net": { label: t('products.addProductForm.label.net'), icon: <TagOutlined /> },
    "weight.gross": { label: t('products.addProductForm.label.gross'), icon: <TagOutlined /> },
  };

  const formatValueByKey = (key: string, value: any): string => {
    if (key === "phone") return FormatUzbekPhoneNumber(String(value));
    return Array.isArray(value) ? value.map(String).join(", ") : String(value);
  };

  const renderTargetFields = (
    target: Record<string, any>,
    targetEntity?: string
  ) => {
    const flatten = (obj: any, prefix = ""): [string, any][] => {
      return Object.entries(obj).flatMap(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          !(value instanceof Date)
        ) {
          return flatten(value, fullKey);
        }
        return [[fullKey, value]];
      });
  };

  const excludedFieldsByEntity: Record<string, string[]> = {
    user: ["companyIds", "id", "status", "firstName", "lastName"],
    company: ["id", "companyId"],
    product: ["id", "companyId"],
  };

  const linkFieldByEntity: Record<string, string> = {
    user: "fullName",
    company: "displayName",
    product: "name",
  };

  if (targetEntity === "user" && target.firstName && target.lastName) {
    target = {
      fullName: `${target.firstName} ${target.lastName}`,
      ...target,
    };
  }

  const excludedFields = excludedFieldsByEntity[targetEntity || ""] || [];
  const linkField = linkFieldByEntity[targetEntity || ""];

  const entityId = target.id;

  return flatten(target)
    .filter(([key, value]) => {
      const baseKey = key.split(".").pop() || key;
      if (excludedFields.includes(baseKey)) return false;
      return value !== null && value !== undefined;
    })
    .map(([key, value], index) => {
  const baseKey = key.split(".").pop() || key;
  const config = targetFieldMap[key] || targetFieldMap[baseKey] || {
    label: baseKey,
    icon: <TagOutlined style={{ color: "#999" }} />,
  };

  let formattedValue: React.ReactNode = formatValueByKey(baseKey, value);

  if (baseKey === linkField && typeof value === "string" && entityId) {
    let path = "";
    switch (targetEntity) {
      case "user":
        path = `/users/${entityId}`;
        break;
      case "company":
        path = `/organization/${entityId}`;
        break;
      case "product":
        path = `/organization/${target.companyId}/products/${target.id}`;
        break;
    }

    if (path) {
      formattedValue = (
        <Link to={path} className="actor-link-hover" style={{ color: "inherit" }}>
          {value}
        </Link>
      );
    }
  }

  return (
    <div className="content-items" key={index}>
      <div className="content-items-item-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Tooltip title={key}>{config.icon}</Tooltip>
        <h5 className="title">{config.label}:</h5>
      </div>
      <div className="content-items-item-description">
        <h5 className="description">{formattedValue}</h5>
      </div>
    </div>
  );
})

};

const handleFilterChange = (filter: string) => {
  setActiveFilter(filter);

  dispatch(
    fetchAuditLogs({
      page: 1,
      limit: dataLimit || 10,
      sortOrder: "desc",
      ...(filter !== "all" ? { category: filter as AuditCategory } : {}),
    })
  );
};



  const filteredLogs =
    activeFilter === "all"
      ? logs
      : logs.filter((log) => log.category === activeFilter);

  return (
    <MainLayout>
      <Heading
        title={t('auditLog.title')}
        subtitle={t('auditLog.subtitle')}
      />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="box-container-items-item"></div>
            <div className="box-container-items-item">
              {/* <Space wrap style={{ marginBottom: 16 }}>
                <Badge count={logs.length} showZero offset={[-10, 0]} color="green">
                  <div style={{ display: "inline-block", lineHeight: "22px" }}>
                    <Tag
                      className="interactive-tag"
                      // style={{
                      //   backgroundColor: "#E6F4EA",
                      //   color: "#52C41A",
                      //   border: "1px solid #52C41A",
                      // }}
                      style={{
                        backgroundColor: "#1B2A1E", // тёмно-зелёный, приглушённый фон
                        color: "#73D13D",           // свежий, читаемый зелёный текст
                        border: "1px solid #389E0D" // немного темнее, чтобы не светился слишком ярко
                      }}

                      onClick={() => setActiveFilter("all")}
                    >
                      {t("categories.all")}
                    </Tag>
                  </div>
                </Badge>

                {uniqueCategories.map((cat) => (
                  <Badge
                    key={cat}
                    offset={[-10, 0]}
                    count={logs.filter((l) => l.category === cat).length}
                    color={categoryBorders[cat] || "gray"}
                  >
                    <div style={{ display: "inline-block", lineHeight: "22px" }}>
                      <Tag
                        className="interactive-tag"
                        style={{
                          backgroundColor: categoryColors[cat],
                          color: categoryBorders[cat],
                          border: `1px solid ${categoryBorders[cat]}`,
                        }}
                        onClick={() => setActiveFilter(cat)}
                      >
                        {t(CategoryMap[cat] || cat)}
                      </Tag>
                    </div>
                  </Badge>
                ))}
                
              </Space> */}
              <Space wrap style={{ marginBottom: 16 }}>
                {[
                  { key: "all", label: t("categories.all"), color: "#73D13D", bg: "#1B2A1E", border: "#389E0D" },
                  { key: "auth", label: t("categories.auth"), color: categoryBorders.auth, bg: categoryColors.auth },
                  { key: "user", label: t("categories.user"), color: categoryBorders.user, bg: categoryColors.user },
                  { key: "company", label: t("categories.organization"), color: categoryBorders.company, bg: categoryColors.company },
                  { key: "product", label: t("categories.product"), color: categoryBorders.product, bg: categoryColors.product },
                ].map((cat) => (
                  <Tag
                    key={cat.key}
                    className="interactive-tag"
                    style={{
                      backgroundColor: cat.bg,
                      color: cat.color,
                      border: `1px solid ${cat.border || cat.color}`,
                      // opacity: activeFilter === cat.key ? 1 : 0.7,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleFilterChange(cat.key)}
                  >
                    {cat.label}
                  </Tag>
                ))}
              </Space>

              <List
                itemLayout="horizontal"
                dataSource={filteredLogs}
                className="audit-logs-list"
                loading={loading}
                renderItem={(item) => {
                const actorInfo = [
                  {
                    label:`${t('users.addUserForm.label.firstName')}`,
                    value: (
                      <Link to={`/users/${item.actorId}`} style={{ color: "inherit" }} className="actor-link-hover">
                        {item.firstName} {item.lastName}
                      </Link>
                    ),
                    icon: <UserOutlined style={{ color: "#1890ff" }} />,
                  },
                  {
                    label: `${t('users.addUserForm.label.email')}`,
                    value: item.email,
                    icon: <GlobalOutlined style={{ color: "#13c2c2" }} />,
                  },
                  {
                    label: `${t('users.addUserForm.label.lastLoggedInAt')}`,
                    value: item.lastLoggedInAt,
                    icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
                  },
                  {
                    label: `${t('users.addUserForm.label.phone')}`,
                    value: FormatUzbekPhoneNumber(item.phone),
                    icon: <UserOutlined style={{ color: "#52c41a" }} />,
                  },
                  {
                    label: `${t('auditLog.ip')}`,
                    value: item.location,
                    icon: <GlobalOutlined style={{ color: "#722ed1" }} />,
                  },
                  {
                    label: `${t('auditLog.id')}`,
                    value: item.requestId,
                    icon: <TagOutlined style={{ color: "#13c2c2" }} />,
                  },
                  {
                    label:`${t('auditLog.session')}`,
                      value: item.correlationId ? item.correlationId.slice(-50) : "",
                    icon: <TagOutlined style={{ color: "#fa541c" }} />,
                  },
                ];
                return (
                  <Card style={{ marginBottom: 12, borderRadius: 12 }} className="audit-logs-card">
                    <Collapse
                      accordion
                      bordered={false}
                      className="audit-logs-card-collapse"
                      expandIcon={({ isActive }) =>
                        isActive ? (
                          <MinusOutlined style={{ color: "green" }} />
                        ) : (
                          <PlusOutlined style={{ color: "green" }} />
                        )
                      }
                      style={{ background: "transparent" }}
                    >
                      <Panel
                        key={item.id}
                        header={
                          <List.Item>
                            <List.Item.Meta
                              avatar={null}
                              title={
                                <Space>
                                  <div className="log-list-heading">
                                    <div className="log-list-heading-container">
                                      <span className="log-list-heading-container-title">
                                        {t(
                                          ActionsMap[item.category]?.[item.action] ||
                                            TypeMap[item.action] ||
                                            item.action
                                        )}
                                      </span>
                                    </div>
                                    <div className="log-list-heading-container">  
                                      {item.message && (
                                        <span className="log-list-heading-container-subtitle">
                                          {item?.message}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Tag
                                    className="interactive-tag"
                                    style={{
                                      backgroundColor: categoryColors[item.category],
                                      color: categoryBorders[item.category],
                                      border: `1px solid ${categoryBorders[item.category]}`,
                                    }}
                                  >
                                    {t(CategoryMap[item.category] || item.category)}
                                  </Tag>
                                </Space>
                              }
                              description={
                                <div className="log-meta">
                                  <div className="log-meta-items">
                                    <span className="log-meta-item">
                                      <UserOutlined /> {item.user}
                                      {(() => {
                                        const targetInfo = getTargetLink(item.targetEntity, item.target);
                                        if (!targetInfo) return null;

                                        return (
                                          <span className="log-list-heading-container-target" style={{ marginLeft: 6 }}>
                                            {" "}<FaArrowRightLong/>{" "}
                                            {targetInfo.path ? (
                                              <Link to={targetInfo.path} className="actor-link-hover">
                                                {targetInfo.name}
                                              </Link>
                                            ) : (
                                              <span>{targetInfo.name}</span>
                                            )}
                                          </span>
                                        );
                                      })()}
                                    </span>

                                    <span className="log-meta-item">
                                      <GlobalOutlined /> {item.location}
                                    </span>
                                  </div>
                                  <div className="log-meta-items">
                                    <span className="log-meta-item item-strong">
                                      {item.date} {item.time}
                                    </span>
                                  </div>
                                </div>
                              }
                            />
                            {/* <Tag
                              color="blue"
                              style={{
                                borderRadius: 16,
                                padding: "4px 12px",
                                marginLeft: "auto",
                              }}
                            >
                              {item.time}
                            </Tag> */}
                          </List.Item>
                        }
                      >
                        <div className="logs-info">
                          <div className="logs-info-container">
                            <div className="logs-info-container-heading">
                              <h3 className="logs-info-container-heading-title">{t('auditLog.committed')}:</h3>
                            </div>
                            <div className="logs-info-container-content">
                              {actorInfo
                                .filter((info) => info.value)
                                .map((info, index) => (
                                  <div className="content-items" key={index}>
                                    <div
                                      className="content-items-item-title"
                                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                                    >
                                      {info.icon}
                                      <h5 className="title">{info.label}:</h5>
                                    </div>
                                    <div className="content-items-item-description">
                                      <h5 className="description">{info.value}</h5>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          {item.target != null && (
                            <div className="logs-info-container">
                              <div className="logs-info-container-heading">
                                <h3 className="logs-info-container-heading-title">{t('auditLog.target')}:</h3>
                              </div>
                              <div className="logs-info-container-content">
                                {renderTargetFields(item.target, item.targetEntity)}
                              </div>
                            </div>
                          )}

                          </div>
                      </Panel>
                    </Collapse>
                  </Card>
                );
              }}
              />

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Pagination
                  current={dataPage || 1}
                  total={dataTotal || 0}
                  pageSize={dataLimit || 10}
                  showSizeChanger={false}
                  onChange={(p) =>
                    dispatch(
                      fetchAuditLogs({
                        page: p,
                        limit: dataLimit || 10,
                        sortOrder: "desc",
                      })
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuditLogsPage




