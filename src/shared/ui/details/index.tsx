import type { CSSProperties, ReactNode } from "react";

type DetailGridVariant = "main" | "single" | "secondary";

export interface DetailItemData {
  label: ReactNode;
  value: ReactNode;
  valueTitle?: string;
}

interface DetailGridProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: DetailGridVariant;
}

interface DetailCardProps {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  full?: boolean;
  headerWithActions?: boolean;
  title?: ReactNode;
  wide?: boolean;
}

interface DetailItemProps {
  children?: ReactNode;
  label: ReactNode;
  showSeparator?: boolean;
  value?: ReactNode;
  valueTitle?: string;
}

interface DetailItemsProps {
  children?: ReactNode;
  items?: DetailItemData[];
}

interface DetailStatProps {
  label: ReactNode;
  value: ReactNode;
}

interface RouteMetaChipProps {
  label: ReactNode;
  value: ReactNode;
  valueTitle?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const DetailGrid = ({
  children,
  className,
  style,
  variant,
}: DetailGridProps) => (
  <div
    className={cx("detail-grid", variant && `detail-grid-${variant}`, className)}
    style={style}
  >
    {children}
  </div>
);

export const DetailCard = ({
  actions,
  children,
  className,
  full = false,
  headerWithActions = false,
  title,
  wide = false,
}: DetailCardProps) => (
  <div className={cx("detail-card", wide && "detail-card-wide", full && "detail-card-full", className)}>
    {title && (actions || headerWithActions) ? (
      <div className={cx("detail-card-header", headerWithActions && "detail-card-header-with-actions")}>
        <h4>{title}</h4>
        {actions}
      </div>
    ) : (
      title && <h4>{title}</h4>
    )}
    {children}
  </div>
);

export const DetailItem = ({
  children,
  label,
  showSeparator = true,
  value,
  valueTitle,
}: DetailItemProps) => (
  <div className="detail-item">
    <span className="label inline-label">{label}</span>
    {showSeparator && <span className="detail-separator">:</span>}
    {children ?? (
      <span className="value" title={valueTitle}>
        {value}
      </span>
    )}
  </div>
);

export const DetailItems = ({ children, items = [] }: DetailItemsProps) => (
  <div className="detail-items">
    {children ??
      items.map((item) => (
        <DetailItem
          key={String(item.label)}
          label={item.label}
          value={item.value}
          valueTitle={item.valueTitle ?? (typeof item.value === "string" || typeof item.value === "number" ? String(item.value) : undefined)}
        />
      ))}
  </div>
);

export const DetailStatsGrid = ({ children }: { children: ReactNode }) => (
  <div className="detail-stats-grid">{children}</div>
);

export const DetailStat = ({ label, value }: DetailStatProps) => (
  <div className="detail-stat">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

export const RouteMetaChip = ({ label, value, valueTitle }: RouteMetaChipProps) => (
  <div className="route-meta-chip">
    <span className="label">{label}</span>
    <span className="value" title={valueTitle}>
      {value}
    </span>
  </div>
);
