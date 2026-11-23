import { LifecycleTargetEntity } from "entities/lifecycle/lib";
import { ApiTags, LIST_TAG_ID, type ApiTag } from "shared/api";
import type { StatusChangeNotification } from "shared/lib/statusChanges";

type ApiTagDescription = { type: ApiTag; id?: string };

/**
 * Теги кеша, которые устаревают от перехода статуса. Списки и карточки
 * перечитывают себя сами, если подписаны: лишнего запроса не будет, а
 * ручная правка строки в сторе больше не нужна.
 */
const tagsByEntity = (
  notification: StatusChangeNotification
): ApiTagDescription[] | null => {
  const { id } = notification.target;

  switch (notification.target.type.name) {
    case LifecycleTargetEntity.MarkingCodeOrderBatch:
    case LifecycleTargetEntity.MarkingCodeOrder:
      return [
        { type: ApiTags.MarkingCodeOrder, id },
        { type: ApiTags.MarkingCodeOrder, id: LIST_TAG_ID },
      ];

    case LifecycleTargetEntity.AggregationReport:
      return [
        { type: ApiTags.AggregationReport, id },
        { type: ApiTags.AggregationReport, id: LIST_TAG_ID },
      ];

    case LifecycleTargetEntity.AggregatedCustomsCodeOrder:
      return [
        { type: ApiTags.CustomsCodeOrder, id },
        { type: ApiTags.CustomsCodeOrder, id: LIST_TAG_ID },
      ];

    default:
      return null;
  }
};

export const statusChangeTagsOf = tagsByEntity;
