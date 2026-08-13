import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type TMessage = {
  id: string;
  content: string;
  conversation_id: string;
  sender_id: string;
  role: string;
  created_at: string;
};

const messagesAdapter = createEntityAdapter<TMessage>({
  sortComparer: (a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
});

type ChatState = {
  loading: boolean;        // ← فقط برای fetchMessages
  sending: boolean;      // ← جدید: فقط برای ارسال پیام
  error: string | null;
  activeConversationId: string | null;
} & ReturnType<typeof messagesAdapter.getInitialState>;

const initialState: ChatState = messagesAdapter.getInitialState({
  loading: false,
  sending: false,        // ← جدید
  error: null,
  activeConversationId: null,
});

export const fetchMessages = createAsyncThunk<
  TMessage[],
  { conversation_id: string },
  { rejectValue: string }
>("chat/fetchMessages", async ({ conversation_id }, thunkApi) => {
  try {
    const res = await fetch(`/api/messages?conversation_id=${conversation_id}`);
    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا در دریافت پیام‌ها");
    }
    return (await res.json()) as TMessage[];
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه");
  }
});

export const chatNewMessage = createAsyncThunk<
  TMessage,
  { content: string; conversation_id: string; role: string },
  { rejectValue: string }
>("chat/chatNewMessage", async (payload, thunkApi) => {
  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا در ارسال پیام");
    }
    return (await res.json()) as TMessage;
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه");
  }
});

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: { payload: string }) => {
      state.activeConversationId = action.payload;
    },
    // ←←← اضافه کردن پیام موقت (optimistic) — اختیاری ولی عالیه
    addOptimisticMessage: (state, action: { payload: TMessage }) => {
      messagesAdapter.addOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        messagesAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload || "خطای ناشناخته";
        state.loading = false;
      })

      // chatNewMessage — loading رو دستکاری نمی‌کنه، فقط sending
      .addCase(chatNewMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(chatNewMessage.fulfilled, (state, action) => {
        messagesAdapter.addOne(state, action.payload);
        state.sending = false;
      })
      .addCase(chatNewMessage.rejected, (state, action) => {
        state.error = action.payload || "خطای ناشناخته";
        state.sending = false;
      });
  },
});

export const { setActiveConversation, addOptimisticMessage } = chatSlice.actions;

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
} = messagesAdapter.getSelectors((state: RootState) => state.chat);

export default chatSlice.reducer;