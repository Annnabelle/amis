import {
    combineReducers,
    configureStore,
    createListenerMiddleware,
    isAnyOf,
    isPlain,
    type TypedStartListening,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { logout, usersSlice } from "entities/users/model";
import { scanSessionsSlice } from "entities/scanSessions/model";
import { accessSlice, clearAccess, setCurrentCompanyId } from "entities/access/model";
import { baseApi } from "shared/api";
import { setRuntimeCompanyId } from "shared/lib/companyContext";

const rootReducer = combineReducers({
    users: usersSlice.reducer,
    scanSessions: scanSessionsSlice.reducer,
    access: accessSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

/**
 * Кеш RTK Query не знает ни про компанию, ни про пользователя: ключ записи —
 * только аргументы запроса. Поэтому при смене организации и при выходе он
 * сбрасывается целиком, иначе на экране окажутся чужие данные.
 *
 * Слушаем сами экшены, а не состояние в store.subscribe: RTK батчит
 * уведомления подписчиков для экшенов RTK Query, и сравнение состояний
 * зависело бы от тайминга.
 */
const companyContextListener = createListenerMiddleware();

const startAppListening =
    companyContextListener.startListening as TypedStartListening<RootState, AppDispatch>;

startAppListening({
    matcher: isAnyOf(setCurrentCompanyId, clearAccess, logout),
    effect: (action, listenerApi) => {
        const previousCompanyId = listenerApi.getOriginalState().access.currentCompanyId;
        const currentCompanyId = listenerApi.getState().access.currentCompanyId;
        const hasCompanyChanged = currentCompanyId !== previousCompanyId;

        if (hasCompanyChanged) {
            setRuntimeCompanyId(currentCompanyId);
        }

        /** Маршрут присылает ту же компанию на каждый переход — это не смена. */
        if (hasCompanyChanged || logout.match(action)) {
            listenerApi.dispatch(baseApi.util.resetApiState());
        }
    },
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                /**
                 * Доменные типы держат Date: дата — значение, и в сторе она
                 * допустима. Класс, File, Map и функция остаются ошибкой.
                 */
                isSerializable: (value: unknown) =>
                    value instanceof Date || isPlain(value),
            },
        })
        .prepend(companyContextListener.middleware)
        .concat(baseApi.middleware),
    });

setRuntimeCompanyId(store.getState().access.currentCompanyId);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
