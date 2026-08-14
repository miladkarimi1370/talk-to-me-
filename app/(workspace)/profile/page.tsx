
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchMyProfile,
  updateProfile,
} from "../../store/profileSlice";
import { Camera, Loader2, Save, User } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, loading, updating } = useAppSelector((state) => state.profile);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    avatar_url: "",
  });

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        username: profile.username || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleSave = () => {
    dispatch(updateProfile(form));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-10">
      <h1 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-2">
        <User size={28} className="text-primary" />
        My Profile
      </h1>

      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-28 h-28">
            {form.avatar_url ? (
              <Image
                src={form.avatar_url}
                alt="avatar"
                fill
                className="rounded-full object-cover border-4 border-surface-elevated shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {form.full_name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform">
              <Camera size={16} />
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-surface-elevated border border-border text-text-primary outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-surface-elevated border border-border text-text-primary outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={updating}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {updating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}