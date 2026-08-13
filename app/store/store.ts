import { configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "./chatSlice";
import { conversationSlice } from "./conversationSlice";
import { usersSlice } from "./usersSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
    conversation: conversationSlice.reducer,
    users: usersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;