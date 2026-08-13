import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

// ─── تایپ پیام ───
type TChat = {
  id: string;
  content: string;
  conversation_id: string;
  sender_id: string;      // ← فرستنده پیام
  role: "user" | "assistant" | "other"; // ← برای نمایش راست/چپ
  created_at: string;
  updated_at?: string;
};

// ─── آداپتر ───
const chatAdapter = createEntityAdapter<TChat>({
  sortComparer: (a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
});

// ─── استیت ───
type ChatState = {
  loading: boolean;
  error: string | null;
  activeConversationId: string | null; // ← چت فعال
} & ReturnType<typeof chatAdapter.getInitialState>;

const initialState: ChatState = chatAdapter.getInitialState({
  loading: false,
  error: null,
  activeConversationId: null,
});

// ─── Thunk ۱: گرفتن پیام‌های یه گفتگو ───
export const fetchMessages = createAsyncThunk<
  TChat[],
  { conversation_id: string },
  { rejectValue: string }
>("chat/fetchMessages", async ({ conversation_id }, thunkApi) => {
  try {
    const res = await fetch(`/api/chat/message?conversation_id=${conversation_id}`);

    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا در دریافت پیام‌ها");
    }

    return (await res.json()) as TChat[];
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه در دریافت پیام‌ها");
  }
});

// ─── Thunk ۲: فرستادن پیام جدید ───
export const chatNewMessage = createAsyncThunk<
  TChat,
  { content: string; conversation_id: string; role?: string },
  { rejectValue: string }
>("chat/newMessage", async ({ content, conversation_id, role = "user" }, thunkApi) => {
  try {
    const res = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content,
        conversation_id,
        role,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا در ارسال پیام");
    }

    return (await res.json()) as TChat;
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه در ارسال پیام");
  }
});

// ─── اسلایس ───
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    setActiveConversation: (state, action: { payload: string | null }) => {
      state.activeConversationId = action.payload;
    },

    addRealtimeMessage: (state, action: { payload: TChat }) => {
      chatAdapter.addOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        chatAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload || "خطای ناشناخته";
        state.loading = false;
      });

    // ─ chatNewMessage ─
    builder
      .addCase(chatNewMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chatNewMessage.fulfilled, (state, action) => {
        chatAdapter.addOne(state, action.payload);
        state.loading = false;
      })
      .addCase(chatNewMessage.rejected, (state, action) => {
        state.error = action.payload || "خطای ناشناخته";
        state.loading = false;
      });
  },
});

// ─── اکشن‌ها ───
export const { setActiveConversation, addRealtimeMessage } = chatSlice.actions;

// ─── سلکتورها ───
export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
} = chatAdapter.getSelectors((state: RootState) => state.chat);

export const selectActiveConversationId = (state: RootState) =>
  state.chat.activeConversationId;

export default chatSlice.reducer;