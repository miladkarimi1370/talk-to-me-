"use client";


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
}