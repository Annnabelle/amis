import type { UnknownAction } from "@reduxjs/toolkit";

import type { RootState } from "app/store";
import { aggregationSlice } from "entities/aggregation/model";
import { customsCodesSlice } from "entities/customsCodes/model";
import { LifecycleTargetEntity } from "entities/lifecycle/lib";
import { markingCodesSlice } from "entities/markingCodes/model";
import type { AggregatedCustomsCodeOrderStatus } from "entities/customsCodes/types";
import type { OrderStatus } from '@edem2000/amis.contracts';
import type { AggregationReportStatus, BatchStatus } from "shared/types/dtos";
import type { StatusChangeNotification } from "shared/lib/statusChanges";

/**
 * Действие, которое правит статус уже загруженной строки, или `null`, если
 * такой строки на экране нет.
 *
 * Коды статусов в уведомлении — те же, что в ответах ручек: и там и там их
 * отдаёт один реестр бэкенда, поэтому приведение типа здесь честное.
 */
type StatusPatch = (
  state: RootState,
  notification: StatusChangeNotification,
) => UnknownAction | null;

const patches: Record<string, StatusPatch> = {
  [LifecycleTargetEntity.MarkingCodeOrderBatch]: (state, { target, status }) =>
    state.markingCodes.data.some((row) => row.batchId === target.id)
      ? markingCodesSlice.actions.batchStatusChanged({
          batchId: target.id,
          status: status.to as BatchStatus,
        })
      : null,

  [LifecycleTargetEntity.MarkingCodeOrder]: (state, { target, status }) =>
    state.markingCodes.data.some((row) => row.orderId === target.id)
      ? markingCodesSlice.actions.orderStatusChanged({
          orderId: target.id,
          status: status.to as OrderStatus,
        })
      : null,

  [LifecycleTargetEntity.AggregationReport]: (state, { target, status }) =>
    state.aggregations.aggregations.some((report) => report.id === target.id) ||
    state.aggregations.oneAggregation?.id === target.id
      ? aggregationSlice.actions.reportStatusChanged({
          id: target.id,
          status: status.to as AggregationReportStatus,
        })
      : null,

  [LifecycleTargetEntity.AggregatedCustomsCodeOrder]: (
    state,
    { target, status },
  ) =>
    state.customsCodes.data.some((order) => order.id === target.id) ||
    state.customsCodes.selected?.id === target.id
      ? customsCodesSlice.actions.orderStatusChanged({
          id: target.id,
          status: status.to as AggregatedCustomsCodeOrderStatus,
        })
      : null,
};

export const statusChangePatchOf = (
  state: RootState,
  notification: StatusChangeNotification,
): UnknownAction | null =>
  patches[notification.target.type.name]?.(state, notification) ?? null;
