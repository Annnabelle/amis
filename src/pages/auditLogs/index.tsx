import { resolveMultiLanguage } from 'shared/lib/multiLanguage';
import { routes } from "shared/config/routes";
import { DEFAULT_PAGINATION } from 'shared/config/pagination';
import React, { useState, useMemo } from "react";
import { Card, Collapse, List, Pagination, Space, Tag } from "antd";
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  MinusOutlined,
  PlusOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import MainLayout from "widgets/appShell";
import Heading from "shared/ui/mainHeading";
import { useTranslation } from "react-i18next";
import { useGetAuditLogsQuery } from "entities/auditLog/api";
import { ActionsMap, CategoryMap, TypeMap } from "./auditMappers";
import { getTargetLink } from "./targetMapper";
import "./styles.sass";
import type { AuditCategory } from "shared/types/dtos";
import type { UserResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import dayjs from "dayjs";
import { PermissionLink } from "entities/access/ui";
import { getTargetAccess, type AuditTarget } from "features/auditTarget/lib/targetFields";
import TargetFields from "features/auditTarget/ui/targetFields";
import { FormatUzbekPhoneNumber } from "shared/lib/utils";
import { formatDate } from 'shared/lib/formatDate';
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const { Panel } = Collapse;

const AuditLogsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [listQuery, setListQuery] = useState<{
    page: number;
    limit: number;
    category?: AuditCategory;
  }>({ ...DEFAULT_PAGINATION });
  const { data: auditLogs, isFetching: loading } = useGetAuditLogsQuery({
    ...listQuery,
    sortOrder: "desc",
  });
  const data = auditLogs?.items;
  const dataPage = listQuery.page;
  const dataLimit = listQuery.limit;
  const dataTotal = auditLogs?.total ?? 0;

 const logs = useMemo(() => {
  if (!data) return [];
  return data.map((log) => {
    const actor: Partial<UserResponseDto> = log.actor ?? {};
    /** Цель события — записи разных сущностей, поля перебираются по ключам. */
    const target = (log.target ?? null) as AuditTarget | null;


    return {
      id: log.id,
      action: log.type,
      category: log.category || "-",
      actorType: log.actorType,
      firstName: actor.firstName || "",
      lastName: actor.lastName || "",
      requestId: log.requestId || "",
      user: actor.firstName && actor.lastName
        ? `${actor.firstName} ${actor.lastName}`
        : "Неизвестно",
      email: actor.email || "",
      phone: actor.phone || "",
      status: actor.status || "",
      actorId: actor.id || "",
      lastLoggedInAt: actor.lastLoggedInAt
        ? formatDate(actor.lastLoggedInAt)
        : "",
      location: log.ip || "—",
      date: formatDate(log.occurredAt),
      time: dayjs(log.occurredAt).format('HH:mm:ss'),
      message: log.message ?? null,
      targetEntity: log.targetEntity || "",
      target,
    };
  });
}, [data]);

  const categoryPalette: Record<string, { bg: string; color: string; border: string }> = {
    all: { bg: "var(--status-success-bg)", color: "var(--status-success-color)", border: "var(--status-success-border)" },
    auth: { bg: "var(--status-cyan-bg)", color: "var(--status-cyan-color)", border: "var(--status-cyan-border)" },
    user: { bg: "var(--status-orange-bg)", color: "var(--status-orange-color)", border: "var(--status-orange-border)" },
    "-": { bg: "var(--status-neutral-bg)", color: "var(--status-neutral-color)", border: "var(--status-neutral-border)" },
    company: { bg: "var(--status-purple-bg)", color: "var(--status-purple-color)", border: "var(--status-purple-border)" },
    product: { bg: "var(--status-warning-bg)", color: "var(--status-warning-color)", border: "var(--status-warning-border)" },
    order: { bg: "var(--status-danger-bg)", color: "var(--status-danger-color)", border: "var(--status-danger-border)" },
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setListQuery((prev) => ({
      page: 1,
      limit: prev.limit,
      category: filter === "all" ? undefined : (filter as AuditCategory),
    }));
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
              <Space wrap style={{ marginBottom: 16 }}>
                {[
                  { key: "all", label: t("categories.all"), ...categoryPalette.all },
                  { key: "auth", label: t("categories.auth"), ...categoryPalette.auth },
                  { key: "user", label: t("categories.user"), ...categoryPalette.user },
                  { key: "company", label: t("categories.organization"), ...categoryPalette.company },
                  { key: "product", label: t("categories.product"), ...categoryPalette.product },
                  { key: "order", label: t("categories.order"), ...categoryPalette.order },
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
                      <PermissionLink
                        endpoint={endpointAccessMap.usersRead}
                        to={routes.user(item.actorId)}
                        style={{ color: "inherit" }}
                        className="actor-link-hover"
                      >
                        {item.firstName} {item.lastName}
                      </PermissionLink>
                    ),
                    icon: <UserOutlined style={{ color: "var(--main-primary)" }} />,
                  },
                  {
                    label: `${t('users.addUserForm.label.email')}`,
                    value: item.email,
                    icon: <GlobalOutlined style={{ color: "var(--status-cyan-color)" }} />,
                  },
                  {
                    label: `${t('users.addUserForm.label.lastLoggedInAt')}`,
                    value: item.lastLoggedInAt,
                    icon: <ClockCircleOutlined style={{ color: "var(--status-warning-color)" }} />,
                  },
                  {
                    label: `${t('users.addUserForm.label.phone')}`,
                    value: FormatUzbekPhoneNumber(item.phone),
                    icon: <UserOutlined style={{ color: "var(--status-success-color)" }} />,
                  },
                  {
                    label: `${t('auditLog.ip')}`,
                    value: item.location,
                    icon: <GlobalOutlined style={{ color: "var(--status-purple-color)" }} />,
                  },
                  {
                    label: `${t('auditLog.id')}`,
                    value: item.requestId,
                    icon: <TagOutlined style={{ color: "var(--status-cyan-color)" }} />,
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
                          <MinusOutlined style={{ color: "var(--event-green)" }} />
                        ) : (
                          <PlusOutlined style={{ color: "var(--event-green)" }} />
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
                                          {resolveMultiLanguage(item.message, i18n.language)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Tag
                                    className="interactive-tag"
                                    style={{
                                      backgroundColor: (categoryPalette[item.category] || categoryPalette["-"]).bg,
                                      color: (categoryPalette[item.category] || categoryPalette["-"]).color,
                                      border: `1px solid ${(categoryPalette[item.category] || categoryPalette["-"]).border}`,
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
                                            {" "}<ArrowRightOutlined/>{" "}
                                            {targetInfo.path && getTargetAccess(item.targetEntity) ? (
                                              <PermissionLink
                                                endpoint={getTargetAccess(item.targetEntity)!}
                                                to={targetInfo.path}
                                                className="actor-link-hover"
                                              >
                                                {targetInfo.name}
                                              </PermissionLink>
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
                                <TargetFields target={item.target} targetEntity={item.targetEntity} />
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
                  showSizeChanger={{ showSearch: false }}
                  pageSizeOptions={['10', '20', '30', '40', '50']}
                  locale={{ items_per_page: '' }}
                  onChange={(p, pageSize) =>
                    setListQuery((prev) => ({
                      ...prev,
                      page: p,
                      limit: pageSize || prev.limit,
                    }))
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








