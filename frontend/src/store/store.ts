import { configureStore } from "@reduxjs/toolkit";
import compilerSlice from "./slices/compilerSlice.ts";
import authSlice from "./slices/authSlice.ts";

export const store = configureStore({
    reducer: {
        compilerSlice,
        authSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>;