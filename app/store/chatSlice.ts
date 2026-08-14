<<<<<<< HEAD
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
=======
import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";


type Tchat = {
    id: string;
    content: string;
    conversation_id: string;
    role: string,
    created_at: string
}
const chatAdapter = createEntityAdapter<Tchat>({
    sortComparer: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
})



type chatState = {
    loading: boolean,
    error: string | null
} & ReturnType<typeof chatAdapter.getInitialState>

const initialState: chatState = chatAdapter.getInitialState({
    loading: false,
    error: null
})


export const fetchMessages = createAsyncThunk<Tchat[], { content?: string }>(
    "chat/fetchMessages", async ({ content }, thunkApi) => {
        try {
            const url = content || content?.trim()

                ? "/api/chat/message?content=" + encodeURIComponent(content)
                : "/api/chat/message";

            const res = await fetch(url);
            if (!res.ok) {
                return thunkApi.rejectWithValue(await res.text());
            }

            return (await res.json()) as Tchat[];

        } catch (err) {
            return thunkApi.rejectWithValue("خطای شبکه");
        }
    }
)

export const chatNewMessage = createAsyncThunk<Tchat, { content: string, conversation_id: string, role: string }>(
    "chat/newMessage", async ({ content, conversation_id, role }, thunkApi) => {
        try {
            const res = await fetch("/api/chat/message", {
                method: "POST",
                body: JSON.stringify({
                    content,
                    conversation_id,  
                    role
                }),
                headers: {
                    "content-type": "application/json"
                }
            });
            if (!res.ok) {
                return thunkApi.rejectWithValue(await res.text());
            }

            return await res.json() as Tchat
        } catch (err) {
            return thunkApi.rejectWithValue("خطای شبکه");
        }
    }
)


export const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(chatNewMessage.pending, (state) => {
            state.loading = true
        })
            .addCase(chatNewMessage.rejected, (state, action) => {
                state.error = action.payload as string || "حطای ناشناخته";
                state.loading = false
            })
            .addCase(chatNewMessage.fulfilled, (state, action) => {
                chatAdapter.addOne(state, action.payload);
                state.loading = false;
            }),

            builder.addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null
            })
                .addCase(fetchMessages.rejected, (state, action) => {
                    state.error = action.payload as string || "خطای ناشناخته در دریافت همه ی کامنت ها "
                })
                .addCase(fetchMessages.fulfilled, (state, action) => {
                    chatAdapter.setAll(state, action.payload);
                    state.loading = false
                })


    },

})

export const { selectAll: selectAllMessages, selectById: selectMessageById } = chatAdapter.getSelectors((state: RootState) => state.chat)

export default chatSlice.reducer

>>>>>>> 292af5e (add complete project)
