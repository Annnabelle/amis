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
import {loaderSlice} from "./loader";

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
        loader: loaderSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false,
        }),
    });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;




