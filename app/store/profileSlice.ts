import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type TProfile = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  last_seen: string | null;
};

type ProfileState = {
  profile: TProfile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
};

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updating: false,
};

export const fetchMyProfile = createAsyncThunk<
  TProfile,
  void,
  { rejectValue: string }
>("profile/fetchMyProfile", async (_, thunkApi) => {
  try {
    const res = await fetch("/api/profile");
    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا در دریافت پروفایل");
    }
    return (await res.json()) as TProfile;
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه");
  }
});

export const updateProfile = createAsyncThunk<
  TProfile,
  Partial<TProfile>,
  { rejectValue: string }
>("profile/updateProfile", async (payload, thunkApi) => {
  try {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      return thunkApi.rejectWithValue(err.error || "خطا در بروزرسانی");
    }
    return (await res.json()) as TProfile;
  } catch {
    return thunkApi.rejectWithValue("خطای شبکه");
  }
});

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.error = action.payload || "خطای ناشناخته";
        state.loading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.updating = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.updating = false;
      });
  },
});

export default profileSlice.reducer;