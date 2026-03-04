import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
    },
    // RTK allows simple state config, no need for middleware as we aren't using thunks here
});
