import { configureStore } from "@reduxjs/toolkit";
<<<<<<< HEAD
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
=======
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
>>>>>>> 292af5e (add complete project)
