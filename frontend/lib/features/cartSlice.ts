import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ItemState = {
    time: number,
    name: string,
    size: string,
    sizePrice: number,
    milk: string,
    milkPrice: number,
    ice: string,
    icePrice: number,
    amount: number,
    price: number,
    image: string
};

type CartState = {
    value: ItemState[];
    lastUpdated: number;
};

const STORAGE_KEY = 'cartState';
const EXPIRATION_TIME = 15 * 60 * 1000;

const loadState = (): CartState => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            return { value: [], lastUpdated: Date.now() };
        }
        const { state, timestamp } = JSON.parse(serializedState);
        if (Date.now() - timestamp > EXPIRATION_TIME) {
            return { value: [], lastUpdated: Date.now() };
        }
        return { value: state, lastUpdated: timestamp };
    } catch (err) {
        return { value: [], lastUpdated: Date.now() };
    }
};

const saveState = (state: CartState) => {
    try {
        const serializedState = JSON.stringify({
            state: state.value,
            timestamp: state.lastUpdated
        });
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch {
        // Ignore write errors
    }
};

const initialState: CartState = loadState();

export const cart = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        emptyCart: (state) => {
            state.value = [];
            state.lastUpdated = Date.now();
            saveState(state);
        },
        addItem: (state, action: PayloadAction<ItemState>) => {
            state.value.push(action.payload);
            state.lastUpdated = Date.now();
            saveState(state);
        },
        deleteItem: (state, action: PayloadAction<number>) => {
            state.value = state.value.filter(item => item.time !== action.payload);
            state.lastUpdated = Date.now();
            saveState(state);
        }
    }
});

export const {emptyCart, addItem, deleteItem} = cart.actions;

export default cart.reducer;