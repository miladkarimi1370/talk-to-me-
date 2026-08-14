"use client";


import {
  Bell,
  Menu,
  Search,
  Loader2,
  MessageCircle,
  MessageSquare,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchConversations,
  selectAllConversations,
} from "../store/conversationSlice";
import {
  fetchAllUsers,
  searchUsers,
  selectAllUsers,
} from "../store/usersSlice";

export default function HeaderChatComponent() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  // ─── Redux State ───
  const conversations = useAppSelector(selectAllConversations);
  const convLoading = useAppSelector((state) => state.conversation.loading);

  const users = useAppSelector(selectAllUsers);
  const usersLoading = useAppSelector((state) => state.users.loading);
  const usersError = useAppSelector((state) => state.users.error);

  // ─── Local State ───
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "people">("chats");

  // ─── Mount: fetch data ───
  useEffect(() => {
    dispatch(fetchConversations());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // ─── Search with debounce ───
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        dispatch(searchUsers(search.trim()));
        setActiveTab("people");
      } else {
        dispatch(fetchAllUsers());
        setActiveTab("chats");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  // ─── Helpers ───
  const isOnline = (lastSeen: string | null) => {
    if (!lastSeen) return false;
    return Date.now() - new Date(lastSeen).getTime() < 2 * 60 * 1000;
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startChat = async (userId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ other_user_id: userId }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      router.push(`/chat/${data.conversation_id}`);
      setSearch("");
      setActiveTab("chats");
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Avatar Renderer ───
  const renderAvatar = (
    avatarUrl: string | null,
    name: string,
    online: boolean,
    size: number = 44
  ) => (
    <div className="relative flex-shrink-0">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={size}
          height={size}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
          {name?.charAt(0).toUpperCase() || "?"}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-elevated" />
      )}
    </div>
  );

  return (
    <>
      {/* ═══ HEADER موبایل ═══ */}
      <header className="w-full h-16 flex items-center justify-between px-4 md:hidden bg-background/80 backdrop-blur-sm border-b border-border fixed top-0 left-0 z-50">
        <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center">
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <Image src="/diagram.svg" alt="logo" width={32} height={32} priority />
          <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Talk to me
          </h1>
        </div>

        <button className="w-10 h-10 rounded-full bg-surface-elevated hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </button>
      </header>

      {/* ═══ SIDEBAR دسکتاپ ═══ */}
      <aside className="hidden md:flex md:flex-col w-80 h-screen bg-surface-elevated border-r border-border shadow-xl fixed top-0 left-0 z-50">
        {/* ─── لوگو ─── */}
        <div className="flex flex-col items-center justify-center py-6 border-b border-border">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Image src="/diagram.svg" alt="logo" width={40} height={40} priority />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
            Talk to me
          </h1>
          <p className="text-xs text-text-secondary">chat with your friends</p>
        </div>

        {/* ─── جستجو ─── */}
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-background border border-border text-sm text-text-primary placeholder-text-secondary outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* ─── تب‌ها ─── */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "chats"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <MessageSquare size={16} />
            Chats
          </button>
          <button
            onClick={() => setActiveTab("people")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "people"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Users size={16} />
            People
          </button>
        </div>

        {/* ─── محتوا ─── */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* ─── تب چت‌ها ─── */}
          {activeTab === "chats" && (
            <>
              {convLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 text-text-secondary text-sm px-4">
                  No conversations yet. Go to People tab to start chatting!
                </div>
              ) : (
                <ul className="space-y-0.5 px-2">
                  {conversations.map((conv) => {
                    const online = isOnline(conv.other_user.last_seen);
                    return (
                      <li key={conv.id}>
                        <Link
                          href={`/chat/${conv.id}`}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 text-text-primary transition-all"
                        >
                          {renderAvatar(
                            conv.other_user.avatar_url,
                            conv.other_user.full_name,
                            online
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold truncate">
                                {conv.other_user.full_name}
                              </p>
                              {conv.last_message && (
                                <span className="text-[10px] text-text-secondary flex-shrink-0">
                                  {formatTime(conv.last_message.created_at)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary truncate mt-0.5">
                              {conv.last_message?.content || "Start chatting..."}
                            </p>
                          </div>

                          {conv.unread_count > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                              {conv.unread_count}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {/* ─── تب افراد ─── */}
          {activeTab === "people" && (
            <>
              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-text-secondary text-sm px-4">
                  {usersError || "No users found"}
                </div>
              ) : (
                <ul className="space-y-0.5 px-2">
                  {users.map((user) => {
                    const online = isOnline(user.last_seen);
                    return (
                      <li key={user.id}>
                        <button
                          onClick={() => startChat(user.id)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 text-text-primary transition-all text-left"
                        >
                          {renderAvatar(
                            user.avatar_url,
                            user.full_name,
                            online
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {user.full_name}
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                              @{user.username}
                            </p>
                          </div>

                          <MessageCircle
                            size={18}
                            className="text-primary flex-shrink-0"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>

        {/* ─── پروفایل کاربر فعلی ─── */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
              {session?.user?.name?.charAt(0).toUpperCase() || "M"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {session?.user?.email || ""}
              </p>
            </div>
            <Bell
              size={18}
              className="text-text-secondary group-hover:text-primary transition-colors"
            />
          </div>
        </div>
      </aside>
    </>
  );
}