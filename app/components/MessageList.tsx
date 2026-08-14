"use client";


import {
  Mic,
  Send,
  Search,
  Loader2,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import { useEffect, useState, useCallback, useMemo, memo } from "react"; // ← memo اضافه شد
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { ChangeGeneralTimeToLocalTime } from "../service/changeGeneralTimeToLocalTime";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchMessages,
  chatNewMessage,
  selectAllMessages,
  setActiveConversation,
} from "../store/chatSlice";
import { fetchConversations } from "../store/conversationSlice";

interface OtherUser {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  last_seen: string | null;
}

interface TChat {
  id: string;
  content: string;
  conversation_id: string;
  sender_id: string;
  role: string;
  created_at: string;
}

// ←←← کامپوننت جداگانه برای هر پیام — با memo ری-رندر نمی‌شه مگر props تغییر کنه
const MessageItem = memo(function MessageItem({
  msg,
  isMe,
  otherUserName,
}: {
  msg: TChat;
  isMe: boolean;
  otherUserName: string;
}) {
  return (
    <div className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${
          isMe ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isMe && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mb-1">
            {otherUserName?.charAt(0).toUpperCase() || "?"}
          </div>
        )}

        <div
          className={`relative p-3.5 rounded-2xl shadow-sm ${
            isMe
              ? "bg-primary text-white rounded-br-none"
              : "bg-surface-elevated dark:bg-[#1E293B] text-text-primary rounded-bl-none"
          }`}
        >
          <p
            className={`text-sm font-medium leading-relaxed ${
              isMe ? "text-white" : "text-text-primary"
            }`}
          >
            {msg.content}
          </p>
          <span
            className={`text-[10px] mt-1.5 block ${
              isMe
                ? "text-white/70 text-right"
                : "text-text-secondary text-left"
            }`}
          >
            {ChangeGeneralTimeToLocalTime(msg.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default function MessageList() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const params = useParams();

  const conversationId = params?.id as string | undefined;

  const [chat, setChat] = useState("");
  const [search, setSearch] = useState("");
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const selector = useAppSelector((state) => state.chat);
  const messages = useAppSelector(selectAllMessages);

  // ←←← هدر رو فقط یک بار لود کن — وقتی conversationId عوض بشه
  useEffect(() => {
    if (!conversationId) {
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    let cancelled = false;

    async function loadConversation() {
      try {
        const res = await fetch(`/api/conversations/${conversationId}`);
        if (!cancelled && res.ok) {
          const data = await res.json();
          setOtherUser(data.other_user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    }

    loadConversation();
    dispatch(setActiveConversation(conversationId));
    dispatch(fetchMessages({ conversation_id: conversationId }));

    // مارک خوانده شدن
    fetch(`/api/conversations/${conversationId}/read`, { method: "POST" })
      .then(() => {
        dispatch(fetchConversations());
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [conversationId, dispatch]);

  // ←←← useCallback برای handler — ری-رندر نمی‌شه مگر ضروری
  const buttonHandler = useCallback(async () => {
    const content = chat.trim();
    if (!content || !conversationId) return;

    setChat("");

    await dispatch(
      chatNewMessage({
        content,
        conversation_id: conversationId,
        role: "user",
      })
    );

    // ←←← non-blocking: await نکن، فقط fire and forget
    dispatch(fetchConversations());
  }, [chat, conversationId, dispatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        buttonHandler();
      }
    },
    [buttonHandler]
  );

  const isMe = useCallback(
    (msg: TChat) => msg.sender_id === session?.user?.id,
    [session?.user?.id]
  );

  const isOnline = useCallback((lastSeen: string | null) => {
    if (!lastSeen) return false;
    return Date.now() - new Date(lastSeen).getTime() < 2 * 60 * 1000;
  }, []);

  // ←←← memoize لیست پیام‌ها — فقط وقتی messages یا otherUser تغییر کنه
  const messageList = useMemo(() => {
    if (messages.length === 0) return null;
    return messages.map((val: TChat) => (
      <MessageItem
        key={val.id}
        msg={val}
        isMe={isMe(val)}
        otherUserName={otherUser?.full_name || "?"}
      />
    ));
  }, [messages, otherUser?.full_name, isMe]);

  // ─── RENDER ───
  return (
    <section className="w-full h-full flex flex-col bg-background">
      {/* ═══ هدر چت ═══ */}
      {loadingUser ? (
        <div className="h-16 px-4 border-b border-border flex items-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : !otherUser ? (
        <div className="h-16 px-4 border-b border-border flex items-center">
          <p className="text-text-secondary text-sm">Conversation not found</p>
        </div>
      ) : (
        <div className="h-16 px-4 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              {otherUser.avatar_url ? (
                <img
                  src={otherUser.avatar_url}
                  alt={otherUser.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {otherUser.full_name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
              {isOnline(otherUser.last_seen) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {otherUser.full_name}
              </p>
              <p className="text-xs text-text-secondary">
                {isOnline(otherUser.last_seen) ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-full hover:bg-surface-elevated flex items-center justify-center text-text-secondary transition-colors cursor-pointer">
              <Phone size={18} />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-surface-elevated flex items-center justify-center text-text-secondary transition-colors cursor-pointer">
              <Video size={18} />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-surface-elevated flex items-center justify-center text-text-secondary transition-colors cursor-pointer">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ═══ جستجو ═══ */}
      <div className="hidden md:block w-full px-4 py-3 border-b border-border">
        <div className="relative h-12 max-w-2xl">
          <input
            type="text"
            className="w-full h-full pl-12 pr-4 outline-none border-none bg-surface-elevated rounded-full text-text-primary placeholder-text-secondary text-sm shadow-sm focus:shadow-md transition-shadow duration-300"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          />
        </div>
      </div>

      {/* ═══ لیست پیام‌ها ═══ */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-5 custom-scrollbar">
        {!conversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 min-h-[300px]">
            <h2 className="text-xl font-semibold text-text-secondary">
              Select a chat
            </h2>
          </div>
        ) : selector.loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : messageList ? (
          messageList
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
              <Send size={24} className="text-primary rotate-[-45deg]" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Start chatting 👋
            </h2>
            <p className="text-text-secondary text-sm">
              Send a message to start the conversation
            </p>
          </div>
        )}
      </div>

      {/* ═══ ورودی پیام ═══ */}
      <div className="w-full px-4 py-3 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3 h-12">
          <div className="relative flex-1 h-full">
            <input
              type="text"
              className="w-full h-full pl-14 pr-4 outline-none border-none bg-surface-elevated rounded-full text-text-primary placeholder-text-secondary text-sm shadow-sm focus:shadow-md transition-shadow duration-300"
              placeholder="Type a message..."
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!conversationId || selector.sending} // ←←← sending به جای loading
            />
            <button className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg cursor-pointer">
              <Mic size={18} className="text-white" />
            </button>
          </div>

          <button
            onClick={buttonHandler}
            disabled={!conversationId || !chat.trim() || selector.sending} // ←←← sending به جای loading
            className="h-full aspect-square rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selector.sending ? ( // ←←← sending
              <Loader2 size={20} className="text-white animate-spin" />
            ) : (
              <Send size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8B5CF6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366F1;
        }
      `}</style>
    </section>
  );
}