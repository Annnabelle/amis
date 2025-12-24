import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { usersSlice } from "./users";
import { organizationsSlice } from "./organization";
import { productsSlice } from "./products";
import {auditLogsSlice} from "./auditLog/index"
import { markingCodesSlice } from "./markingCodes";
import { referencesSlice } from "./references";
import {utilizationSlice} from "./utilization";
import {aggregationSlice} from "./aggregation";

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

