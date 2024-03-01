import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CompilerSliceStateType{
    fullCode: {
        html: string;
        css: string;
        javascript: string;
    };
    title: string;
    description: string;
    currentLanguage: "html" | "css" | "javascript";
}

const initialState: CompilerSliceStateType = {
    fullCode: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title of the Document</title>
</head>
<body>
    <!-- Your content goes here -->
    <h1>Hello World !</h1>
</body>
</html>
`,
        css: `body {
     /* Write your code... */
}`,
        javascript: `document.addEventListener("DOMContentLoaded", function() {
    // Code here will run after the DOM is fully loaded
    // You can start writing your JavaScript code here
});
        `
    },
    currentLanguage: "html",
    title: "",
    description: ""
}

const compilerSlice = createSlice({
    name: 'compilerSlice',
    initialState,
    reducers: {
        updateCurrentLanguage: (state, action: PayloadAction<CompilerSliceStateType["currentLanguage"]>) => {
            state.currentLanguage = action.payload;
        },
        updateCodeValue: (state, action: PayloadAction<string>) => {
            state.fullCode[state.currentLanguage] = action.payload;
        },
        updateFullCode: (state, action: PayloadAction<CompilerSliceStateType["fullCode"]>) => {
            state.fullCode = action.payload
        },
        updateTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
        updateDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload
        },

    }
})

export default compilerSlice.reducer

export const {
    updateCurrentLanguage,
    updateCodeValue,
    updateFullCode,
    updateTitle,
    updateDescription
} = compilerSlice.actions