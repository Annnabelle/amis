import { Alert, Segmented, Skeleton, Tabs } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "app/store";
import {
  getLifecycleTabFilters,
  getLifecycleTargetConfig,
  hasMoreLifecycleEvents,
  useLifecycleSummary,
  type LifecycleTargetType,
} from "entities/lifecycle/lib";
import {
  getLifecycleEvents,
  LIFECYCLE_DEFAULT_LIMIT,
  resetLifecycle,
} from "entities/lifecycle/model";
import {
  LIFECYCLE_ALL_TAB_KEY,
  LifecycleEventKind,
  LifecycleScope,
  type LifecycleTab,
} from "entities/lifecycle/types";
import LifecycleActiveErrorAlert from "entities/lifecycle/ui/activeErrorAlert";
import LifecycleTimeline from "entities/lifecycle/ui/timeline";
import CustomButton from "shared/ui/button";
import "entities/lifecycle/ui/styles.sass";

type LifecyclePanelProps = {
  targetId?: string;
  target: LifecycleTargetType;
  className?: string;
};

const KIND_FILTER_ALL = "all";

type KindFilter = typeof KIND_FILTER_ALL | LifecycleEventKind;

const getTabLabel = (
  tab: LifecycleTab,
  t: (key: string, options?: Record<string, unknown>) => string
) => {
  if (tab.key === LIFECYCLE_ALL_TAB_KEY) return t("lifecycle.feedTabs.all");
  if (tab.vendor) {
    return t(`lifecycle.vendors.${tab.vendor}`, { defaultValue: tab.vendor });
  }
  if (tab.scope === LifecycleScope.Internal) {
    return t("lifecycle.feedTabs.internal");
  }

  return t(`lifecycle.feedTabs.${tab.key}`, { defaultValue: tab.key });
};

const LifecyclePanel = ({ targetId, target, className }: LifecyclePanelProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    canRead,
    summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useLifecycleSummary(targetId, target);
  const events = useAppSelector((state) => state.lifecycle.events);
  const page = useAppSelector((state) => state.lifecycle.page);
  const limit = useAppSelector((state) => state.lifecycle.limit);
  const total = useAppSelector((state) => state.lifecycle.total);
  const isEventsLoading = useAppSelector((state) => state.lifecycle.eventsLoading);
  const eventsError = useAppSelector((state) => state.lifecycle.eventsError);

  const [activeTabKey, setActiveTabKey] = useState(LIFECYCLE_ALL_TAB_KEY);
  const [kindFilter, setKindFilter] = useState<KindFilter>(KIND_FILTER_ALL);

  const tabs = useMemo(() => summary?.tabs ?? [], [summary]);
  const activeTab = useMemo(
    () => tabs.find((tab) => tab.key === activeTabKey),
    [activeTabKey, tabs]
  );
  /**
   * Фильтры держим примитивами, а не объектом: объект пересоздаётся, когда
   * приезжает сводка и вкладка 'all' находится в списке, — эффект ниже срабатывал
   * второй раз и первый заход на ленту стоил двух одинаковых запросов.
   */
  const { scope: feedScope, vendor: feedVendor } = getLifecycleTabFilters(activeTab);
  const feedKind = kindFilter === KIND_FILTER_ALL ? undefined : kindFilter;

  /** Пришли вкладки, которых нет — откатываемся на сводную. */
  useEffect(() => {
    if (tabs.length === 0 || tabs.some((tab) => tab.key === activeTabKey)) return;

    setActiveTabKey(LIFECYCLE_ALL_TAB_KEY);
  }, [activeTabKey, tabs]);

  useEffect(() => {
    if (!targetId || !canRead) return;

    void dispatch(
      getLifecycleEvents({
        targetId,
        scope: feedScope,
        vendor: feedVendor,
        kind: feedKind,
        page: 1,
        limit: LIFECYCLE_DEFAULT_LIMIT,
        companyScope: getLifecycleTargetConfig(target).companyScope,
      })
    );
  }, [canRead, dispatch, feedKind, feedScope, feedVendor, target, targetId]);

  useEffect(() => () => {
    dispatch(resetLifecycle());
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!targetId) return;

    void dispatch(
      getLifecycleEvents({
        targetId,
        scope: feedScope,
        vendor: feedVendor,
        kind: feedKind,
        page: page + 1,
        limit,
        companyScope: getLifecycleTargetConfig(target).companyScope,
      })
    );
  };

  if (!targetId || !canRead) return null;

  if (isSummaryLoading && !summary) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  if (summaryError && !summary) {
    return <Alert type="error" showIcon message={t(summaryError)} />;
  }

  const hasMore = hasMoreLifecycleEvents(page, limit, total);

  return (
    <div className={["lifecycle-panel", className].filter(Boolean).join(" ")}>
      {summary?.activeError && (
        <LifecycleActiveErrorAlert error={summary.activeError} />
      )}

      <div className="lifecycle-panel-head">
        <span className="lifecycle-panel-total">
          {t("lifecycle.total")}: {summary?.total ?? 0}
        </span>
        <Segmented<KindFilter>
          size="small"
          value={kindFilter}
          onChange={setKindFilter}
          options={[
            { label: t("lifecycle.filters.all"), value: KIND_FILTER_ALL },
            { label: t("lifecycle.filters.status"), value: LifecycleEventKind.Status },
            { label: t("lifecycle.filters.error"), value: LifecycleEventKind.Error },
          ]}
        />
      </div>

      {tabs.length > 0 && (
        <Tabs
          className="lifecycle-feed-tabs"
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          items={tabs.map((tab) => ({
            key: tab.key,
            label: (
              <span className="lifecycle-tab-label">
                {getTabLabel(tab, t)}
                <span className="lifecycle-tab-count">{tab.count}</span>
              </span>
            ),
          }))}
        />
      )}

      {eventsError && (
        <Alert type="error" showIcon message={t(eventsError)} />
      )}

      {isEventsLoading && events.length === 0 ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <LifecycleTimeline events={events} target={target} />
      )}

      {(hasMore || events.length > 0) && (
        <div className="lifecycle-footer">
          {hasMore && (
            <CustomButton
              variant="outline"
              size="sm"
              fullWidth={false}
              loading={isEventsLoading}
              onClick={handleLoadMore}
            >
              {t("lifecycle.loadMore")}
            </CustomButton>
          )}
          <span className="lifecycle-shown">
            {t("lifecycle.shown", { count: events.length })}
          </span>
        </div>
      )}
    </div>
  );
};

export { LifecycleActiveErrorAlert };
export default LifecyclePanel;
