"use client";


import { selectAllConversations } from "@/app/store/conversationSlice";
import { useAppSelector } from "@/app/store/hooks";
import { MessageSquare, ArrowRight } from "lucide-react";

import Link from "next/link";

export default function ChatLandingPage() {
  const conversations = useAppSelector(selectAllConversations);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
        <MessageSquare size={40} className="text-primary" />
      </div>

      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Welcome to Talk to me
      </h1>
      <p className="text-text-secondary text-sm max-w-sm mb-8">
        Select a conversation from the sidebar or search for people to start chatting.
      </p>

      {conversations.length > 0 && (
        <div className="space-y-2 w-full max-w-xs">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-3">
            Recent conversations
          </p>
          {conversations.slice(0, 3).map((conv) => (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className="flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl bg-surface-elevated hover:bg-primary/5 border border-border hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {conv.other_user.full_name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {conv.other_user.full_name}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {conv.last_message?.content || "Start chatting..."}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-text-secondary group-hover:text-primary transition-colors flex-shrink-0"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}