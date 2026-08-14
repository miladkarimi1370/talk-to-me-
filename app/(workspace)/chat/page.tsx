"use client";

<<<<<<< HEAD
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
=======

import { useEffect, useState } from "react";
import MessageList from "../../components/MessageList";
import { useSession } from "next-auth/react";
import { Bounce, toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";



export default function Chat() {
    // ✅ برای جلوگیری از خطای Hydration در بخش‌های پویا
    const [mounted, setMounted] = useState(false);
    const { data: session, status } = useSession();
    const [toastShown, setToastShown] = useState<boolean>(false)
    useEffect(() => {
        setMounted(true);

    }, []);

 useEffect(() => {
    if (status === "authenticated" && session?.user?.name && !toastShown) {
    
      toast.success(`خوش آمدید ${session.user.name} 👋`, {
        position: "top-center",
        autoClose: 3000,
      });
      setToastShown(true);
    }
  }, [status, session, toastShown]);

    // اگر کامپوننت هنوز نصب نشده، یک placeholder نمایش بده
    if (!mounted) {
        return (
            <main className="bg-background w-screen h-screen py-4 flex flex-col items-center justify-between">
                <div className="w-11/12 h-2/12 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-surface-elevated animate-pulse"></div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-surface-elevated animate-pulse"></div>
                        <div className="w-32 h-5 bg-surface-elevated rounded animate-pulse"></div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-surface-elevated animate-pulse"></div>
                </div>
            </main>
        );
    }

    return (

        <>
            <MessageList />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </>

    );
>>>>>>> 292af5e (add complete project)
}