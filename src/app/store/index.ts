import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { usersSlice } from "entities/users/model";
import { organizationsSlice } from "entities/organization/model";
import { productsSlice } from "entities/products/model";
import {auditLogsSlice} from "entities/auditLog/model"
import { markingCodesSlice } from "entities/markingCodes/model";
import { referencesSlice } from "entities/references/model";
import {utilizationSlice} from "entities/utilization/model";
import {aggregationSlice} from "entities/aggregation/model";
import {xTraceSlice} from "entities/xTrace/model";
import {exportSlice} from "entities/export/model";
import { salesOrdersSlice } from "entities/salesOrders/model";
import { deliveryRoutesSlice } from "entities/deliveryRoutes/model";
import { deliveryTasksSlice } from "entities/deliveryTasks/model";
import { invoicesSlice } from "entities/invoices/model";
import { scanSessionsSlice } from "entities/scanSessions/model";
import { accessSlice } from "entities/access/model";
import { systemEmployeesSlice } from "entities/systemEmployees/model";
import {loaderSlice} from "./loader";
import { setRuntimeCompanyId } from "shared/lib/companyContext";

export const store = configureStore({
    reducer: {
        users: usersSlice.reducer,
        organizations: organizationsSlice.reducer,
        products: productsSlice.reducer,
        auditLogs: auditLogsSlice.reducer,
        markingCodes: markingCodesSlice.reducer,
        references: referencesSlice.reducer,
        utilization: utilizationSlice.reducer,
        aggregations: aggregationSlice.reducer,
        xTrace: xTraceSlice.reducer,
        export: exportSlice.reducer,
        salesOrders: salesOrdersSlice.reducer,
        deliveryRoutes: deliveryRoutesSlice.reducer,
        deliveryTasks: deliveryTasksSlice.reducer,
        invoices: invoicesSlice.reducer,
        scanSessions: scanSessionsSlice.reducer,
        access: accessSlice.reducer,
        systemEmployees: systemEmployeesSlice.reducer,
        loader: loaderSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false,
        }),
    });

let previousCompanyId = store.getState().access.currentCompanyId;
setRuntimeCompanyId(previousCompanyId);

store.subscribe(() => {
    const currentCompanyId = store.getState().access.currentCompanyId;

    if (currentCompanyId !== previousCompanyId) {
        previousCompanyId = currentCompanyId;
        setRuntimeCompanyId(currentCompanyId);
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;




