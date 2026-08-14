import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type TNotification = {
  id: string;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
};

const adapter = createEntityAdapter<TNotification>({
  sortComparer: (a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
});

type NotificationState = {
  loading: boolean;
  error: string | null;
} & ReturnType<typeof adapter.getInitialState>;

const initialState: NotificationState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const fetchNotifications = createAsyncThunk<
  TNotification[],
  void,
  { rejectValue: string }
>("notifications/fetchNotifications", async (_, thunkApi) => {
  try {
    const res = await fetch("/api/notifications");
    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا");
    }
    return (await res.json()) as TNotification[];
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه");
  }
});

export const markNotificationRead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notifications/markRead", async (id, thunkApi) => {
  try {
    const res = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا");
    }
    return id;
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه");
  }
});

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        adapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload || "خطا";
        state.loading = false;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        adapter.updateOne(state, {
          id: action.payload,
          changes: { read: true },
        });
      });
  },
});

export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
} = adapter.getSelectors((state: RootState) => state.notifications);

export const selectUnreadCount = (state: RootState) =>
  selectAllNotifications(state).filter((n) => !n.read).length;

export default notificationSlice.reducer;