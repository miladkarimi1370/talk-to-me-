import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type TConversation = {
  id: string;
  title: string | null;
  created_by: string;
  is_group: boolean;
  created_at: string;
  updated_at: string;
  other_user: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
    last_seen: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
  } | null;
  unread_count: number;
};

const conversationAdapter = createEntityAdapter<TConversation>({
  sortComparer: (a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
});

type ConversationState = {
  loading: boolean;
  error: string | null;
} & ReturnType<typeof conversationAdapter.getInitialState>;

const initialState: ConversationState = conversationAdapter.getInitialState({
  loading: false,
  error: null,
});

export const fetchConversations = createAsyncThunk<
  TConversation[],
  void,
  { rejectValue: string }
>("conversation/fetchConversations", async (_, thunkApi) => {
  try {
    const res = await fetch("/api/conversations");
    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا در دریافت گفتگوها");
    }
    return (await res.json()) as TConversation[];
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه");
  }
});

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        conversationAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.error = action.payload || "خطای ناشناخته";
        state.loading = false;
      });
  },
});

export const {
  selectAll: selectAllConversations,
  selectById: selectConversationById,
} = conversationAdapter.getSelectors((state: RootState) => state.conversation);

export default conversationSlice.reducer;