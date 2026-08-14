"use client";

import { useEffect, useState } from "react";

import { Search, Loader2, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchAllUsers, selectAllUsers } from "@/app/store/usersSlice";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const loading = useAppSelector((state) => state.users.loading);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <User size={28} className="text-primary" />
        All Users
      </h1>

      <div className="relative mb-6 max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-elevated border border-border text-text-primary outline-none focus:border-primary transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-xl bg-surface-elevated border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {user.full_name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    @{user.username}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/users/${user.id}`}
                  className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium text-center hover:bg-primary/20 transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  href={`/chat/${user.id}`} // یا startChat logic
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-xs font-medium text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                >
                  <MessageCircle size={14} />
                  Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}