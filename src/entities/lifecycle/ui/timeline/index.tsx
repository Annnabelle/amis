import { Empty } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  groupLifecycleEventsByDay,
  type LifecycleTargetType,
} from "entities/lifecycle/lib";
import type { LifecycleEvent } from "entities/lifecycle/types";
import LifecycleEventItem from "entities/lifecycle/ui/eventItem";
import "../styles.sass";

type LifecycleTimelineProps = {
  events: LifecycleEvent[];
  target: LifecycleTargetType;
  emptyText?: string;
};

const formatGroupDate = (date: string, todayText: string, yesterdayText: string) => {
  const day = dayjs(date);

  if (day.isSame(dayjs(), "day")) return todayText;
  if (day.isSame(dayjs().subtract(1, "day"), "day")) return yesterdayText;

  return day.format("DD.MM.YYYY");
};

const LifecycleTimeline = ({
  events,
  target,
  emptyText,
}: LifecycleTimelineProps) => {
  const { t } = useTranslation();
  const groups = useMemo(() => groupLifecycleEventsByDay(events), [events]);

  if (events.length === 0) {
    return <Empty description={emptyText ?? t("lifecycle.empty")} />;
  }

  return (
    <div className="lifecycle-timeline">
      {groups.map((group, groupIndex) => (
        <section className="lifecycle-group" key={group.date}>
          <span className="lifecycle-group-date">
            {formatGroupDate(
              group.date,
              t("lifecycle.groups.today"),
              t("lifecycle.groups.yesterday")
            )}
          </span>
          <ul className="lifecycle-events">
            {group.events.map((event, eventIndex) => (
              <LifecycleEventItem
                key={event.id}
                event={event}
                target={target}
                isLast={
                  groupIndex === groups.length - 1 &&
                  eventIndex === group.events.length - 1
                }
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default LifecycleTimeline;
