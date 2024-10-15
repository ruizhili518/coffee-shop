import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const loading = createSlice({
    name: 'loading',
    initialState: true,
    reducers: {
        setLoadingInitial: () => {
            return true;
        },
        finishLoading: (state, action: PayloadAction<boolean>) => {
            return action.payload;
        }
    }
});

export const {setLoadingInitial, finishLoading} = loading.actions;

export default loading.reducer;