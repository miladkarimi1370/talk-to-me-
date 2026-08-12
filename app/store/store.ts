import { configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "./chatSlice";
import { conversationSlice } from "./conversation";



export const store = configureStore({
    reducer: {
       chat : chatSlice.reducer , 
       conversation : conversationSlice.reducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch