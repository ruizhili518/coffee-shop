import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Product} from "@/lib/types";

export type ItemState = {
    time: number,
    size: string,
    sizePrice: number,
    milk: string,
    milkPrice: number,
    ice: string,
    icePrice: number,
    amount: number,
    price: number,
    product: Product
};

type CartState = {
    value: ItemState[];
    lastUpdated: number;
};

// Using local storage to store the cart state for 15 min.
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

const getDiscount = (product: Product , amount: number) => {
    if(amount <= product.buy) return amount;
    const free = Math.floor(amount / (product.buy + product.getFree));
    return (amount - free);
} // Return the number of the items user need to pay based on buy and getFree.

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
        addItemQuantity: (state, action: PayloadAction<number>) => {
            const selectedItem = state.value.filter(item => item.time === action.payload)[0];
            const unitPrice = selectedItem.product.baseprice + selectedItem.milkPrice + selectedItem.sizePrice + selectedItem.icePrice;
            selectedItem.amount = selectedItem.amount + 1;
            selectedItem.price = selectedItem.product.buy === 0 ? (unitPrice * selectedItem.amount) : (unitPrice * getDiscount(selectedItem.product, selectedItem.amount));
            state.lastUpdated = Date.now();
            saveState(state);
        },
        minusItemQuantity: (state, action: PayloadAction<number>) => {
            const selectedItem = state.value.filter(item => item.time === action.payload)[0];
            if(selectedItem.amount === 1){
                state.value = state.value.filter(item => item.time !== action.payload);
            }else{
                const unitPrice = selectedItem.product.baseprice + selectedItem.milkPrice + selectedItem.sizePrice + selectedItem.icePrice;
                selectedItem.amount = selectedItem.amount - 1;
                selectedItem.price = selectedItem.product.buy === 0 ? (unitPrice * selectedItem.amount) : (unitPrice * getDiscount(selectedItem.product, selectedItem.amount));
            }
            state.lastUpdated = Date.now();
            saveState(state);
        }
    }
});

export const {emptyCart, addItem, addItemQuantity, minusItemQuantity} = cart.actions;

export default cart.reducer;