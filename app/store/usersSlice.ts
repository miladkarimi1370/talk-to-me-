import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type TUser = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  last_seen: string | null;
};

const usersAdapter = createEntityAdapter<TUser>({
  sortComparer: (a, b) => a.full_name.localeCompare(b.full_name),
});

type UsersState = {
  loading: boolean;
  error: string | null;
  searchQuery: string;
} & ReturnType<typeof usersAdapter.getInitialState>;

const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: null,
  searchQuery: "",
});

// ─── Thunk: گرفتن همه کاربران ───
export const fetchAllUsers = createAsyncThunk<TUser[], void, { rejectValue: string }>(
  "users/fetchAllUsers",
  async (_, thunkApi) => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const err = await res.json();
        return thunkApi.rejectWithValue(err.error || "خطا در دریافت کاربران");
      }
      return (await res.json()) as TUser[];
    } catch {
      return thunkApi.rejectWithValue("خطای شبکه");
    }
  }
);

// ─── Thunk: سرچ کاربران ───
export const searchUsers = createAsyncThunk<TUser[], string, { rejectValue: string }>(
  "users/searchUsers",
  async (query, thunkApi) => {
    try {
      const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const err = await res.json();
        return thunkApi.rejectWithValue(err.error || "خطا در جستجو");
      }
      return (await res.json()) as TUser[];
    } catch {
      return thunkApi.rejectWithValue("خطای شبکه");
    }
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchQuery: (state, action: { payload: string }) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        usersAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload || "خطای ناشناخته";
        state.loading = false;
      })

      // searchUsers
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        usersAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.error = action.payload || "خطای ناشناخته";
        state.loading = false;
      });
  },
});

export const { setSearchQuery } = usersSlice.actions;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state: RootState) => state.users);

export default usersSlice.reducer;