import { configureStore } from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from "react-redux";
import authReducer from './features/authSlice';

export const store = () => {
    return configureStore({
        reducer: {
            authReducer
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;