import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { usersSlice } from "entities/users/model";
import { scanSessionsSlice } from "entities/scanSessions/model";
import { accessSlice } from "entities/access/model";
import {loaderSlice} from "./loader";
import { baseApi } from "shared/api";
import { setRuntimeCompanyId } from "shared/lib/companyContext";

export const store = configureStore({
    reducer: {
        users: usersSlice.reducer,
        scanSessions: scanSessionsSlice.reducer,
        access: accessSlice.reducer,
        loader: loaderSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false,
        }).concat(baseApi.middleware),
    });

let previousCompanyId = store.getState().access.currentCompanyId;
let wasAuthenticated = store.getState().users.isAuthenticated;
setRuntimeCompanyId(previousCompanyId);

store.subscribe(() => {
    const { access, users } = store.getState();

    if (access.currentCompanyId !== previousCompanyId) {
        previousCompanyId = access.currentCompanyId;
        setRuntimeCompanyId(access.currentCompanyId);
        // Ключи кеша RTK Query не содержат компанию, поэтому при переключении
        // организации кеш сбрасывается целиком — иначе покажем чужие данные.
        store.dispatch(baseApi.util.resetApiState());
    }

    if (wasAuthenticated && !users.isAuthenticated) {
        wasAuthenticated = false;
        // Выход из сессии: данные прошлого пользователя в кеше не оставляем.
        store.dispatch(baseApi.util.resetApiState());

        return;
    }

    wasAuthenticated = users.isAuthenticated;
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;




