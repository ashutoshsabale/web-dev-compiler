import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthType {
    currentUser?: {
        username?: string;
        email?: string;
        avatar?: string;
        savedCodes?: string[];
    };
    isLoggedIn: boolean;
}

const initialState: AuthType = {
    currentUser: {},
    isLoggedIn: false,
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        updateCurrentUser: (state, action: PayloadAction<AuthType["currentUser"]>) => {
            state.currentUser = action.payload
        },
        updateLoggedInUser: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        },
    }

})

export default authSlice.reducer

export const { updateCurrentUser, updateLoggedInUser } = authSlice.actions