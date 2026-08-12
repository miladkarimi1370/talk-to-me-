"use client";

import { useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

interface Props {
    userName: string | null
}

export default function WelcomeToast(user: Props) {
    useEffect(() => {
        if (user) {
            toast.success("Dear " + user.userName +" : your are login", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    })
    return (
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
    )
}