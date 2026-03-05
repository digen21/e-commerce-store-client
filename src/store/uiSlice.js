import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage on init
const loadCartFromStorage = () => {
    try {
        const cartJson = localStorage.getItem('cart');
        if (cartJson) {
            return JSON.parse(cartJson);
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }
    return [];
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const initialState = {
    isCartOpen: false,
    isMobileMenuOpen: false,
    theme: 'dark', // the prompt requested a dark charcoal background
    // We'll manage cart state in RTK or Context. RTK is good for cart since it's global UI
    cart: loadCartFromStorage(),
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
            const newItem = action.payload;
            // Create a unique key based on product ID and variant (if exists)
            const newItemKey = newItem.variant ? `${newItem.id}-${newItem.variant}` : newItem.id;

            // Find existing item with same product ID and variant
            const existingItem = state.cart.find((item) => {
                const existingKey = item.variant ? `${item.id}-${item.variant}` : item.id;
                return existingKey === newItemKey;
            });

            if (existingItem) {
                // Same product and variant - increase quantity
                existingItem.quantity += 1;
            } else {
                // New product or different variant - add as new item
                state.cart.push({ ...newItem, quantity: 1 });
            }
            state.isCartOpen = true; // Open cart on add
            saveCartToStorage(state.cart); // Persist to localStorage
        },
        removeFromCart: (state, action) => {
            // action.payload can be either an ID string or an object with id and variant
            const payload = action.payload;
            let removeKey, removeVariant;

            if (typeof payload === 'object' && payload.id) {
                removeKey = payload.id;
                removeVariant = payload.variant;
            } else {
                // Find the item by ID first to check if it has a variant
                const item = state.cart.find(item => item.id === payload);
                removeKey = payload;
                removeVariant = item?.variant;
            }

            const itemKey = removeVariant ? `${removeKey}-${removeVariant}` : removeKey;

            state.cart = state.cart.filter((item) => {
                const existingKey = item.variant ? `${item.id}-${item.variant}` : item.id;
                return existingKey !== itemKey;
            });
            saveCartToStorage(state.cart); // Persist to localStorage
        },
        updateQuantity: (state, action) => {
            const { id, quantity, variant } = action.payload;
            const itemKey = variant ? `${id}-${variant}` : id;

            const product = state.cart.find((item) => {
                const existingKey = item.variant ? `${item.id}-${item.variant}` : item.id;
                return existingKey === itemKey;
            });

            if (product) {
                product.quantity = quantity;
            }
            saveCartToStorage(state.cart); // Persist to localStorage
        },
        clearCart: (state) => {
            state.cart = [];
            saveCartToStorage(state.cart); // Persist to localStorage
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
