import {
  resolveStatusVariant,
  LifecycleScope,
  type StatusEntity,
} from "shared/config/statusCatalog";
import { useStatusLabel } from "shared/lib/useStatusLabel";
import StatusBadge, { type StatusBadgeMode } from "shared/ui/statusBadge";

type EntityStatusBadgeProps = {
  /** Не задана — цвет берётся из общей карты по коду, текст из fallbackLabel. */
  entity?: StatusEntity;
  scope?: LifecycleScope;
  status?: string | null;
  mode?: StatusBadgeMode;
  className?: string;
  /** Подпись извне (например toLabel из lifecycle), если кода нет в каталоге. */
  fallbackLabel?: string | null;
};

const EntityStatusBadge = ({
  entity,
  scope = LifecycleScope.Internal,
  status,
  mode = "full",
  className,
  fallbackLabel,
}: EntityStatusBadgeProps) => {
  const label = useStatusLabel(entity, scope, status, fallbackLabel);

  if (!status) return null;

  return (
    <StatusBadge
      className={className}
      mode={mode}
      variant={resolveStatusVariant(entity, scope, status)}
      title={label}
    >
      {label}
    </StatusBadge>
  );
};

export default EntityStatusBadge;
