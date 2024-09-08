import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    value: {
        username: "",
        userId: 0,
        coupons: [],
        customerName: "",
        orderHistory: [],
        email: "",
        points: 0,
        role: "VISITOR"
    } as AuthState
} as InitialState; //Set initial state of the user.

export type AuthState = {
    username: string,
    userId: number,
    coupons: Array<object>,
    customerName: string,
    orderHistory: Array<object>,
    email: string,
    points: number,
    role: string
}; //Type of the value.

 export type InitialState = {
    value: AuthState;
}; //Type of the state.

export const auth = createSlice({
    name: 'auth',
    initialState : initialState,
    reducers: {
        signOutAuth: () => {
            return initialState;
        },

        signInAuth: (state, action: PayloadAction<AuthState>) => {
            return {
                value : action.payload
            }
        }
    }
});

export const {signInAuth, signOutAuth} = auth.actions;

export default auth.reducer;