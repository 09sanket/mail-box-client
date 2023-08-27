import { configureStore } from '@reduxjs/toolkit'
import globalSlice from './globalSlice';
const Store = configureStore({
    reducer: { global: globalSlice.reducer }
});

export default Store;