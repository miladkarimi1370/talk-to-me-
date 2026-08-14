import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./conversationSlice";
import usersReducer from "./usersSlice";
import chatReducer from "./chatSlice";
import profileReducer from "./profileSlice";
import themeReducer from "./themeSlice";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    users: usersReducer,
    chat: chatReducer,
    profile: profileReducer,
    theme: themeReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;