"use client";

import MessageList from "../../../components/MessageList";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatIdPage() {
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const [toastShown, setToastShown] = useState(false);

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

  if (!mounted) {
    return (
      <main className="bg-background w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-surface-elevated animate-pulse" />
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
}