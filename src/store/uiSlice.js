import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isCartOpen: false,
    isMobileMenuOpen: false,
    theme: 'dark', // the prompt requested a dark charcoal background
    // We'll manage cart state in RTK or Context. RTK is good for cart since it's global UI
    cart: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        toggleMobileMenu: (state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
        addToCart: (state, action) => {
            const existingProduct = state.cart.find((item) => item.id === action.payload.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
            state.isCartOpen = true; // Open cart on add
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const product = state.cart.find((item) => item.id === id);
            if (product) {
                product.quantity = quantity;
            }
        },
        clearCart: (state) => {
            state.cart = [];
        }
    },
});

export const {
    toggleCart,
    toggleMobileMenu,
    toggleTheme,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
} = uiSlice.actions;

export default uiSlice.reducer;
