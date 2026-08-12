"use client";
import { Mic, Send } from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";

export default function InputAskedFromClient() {
    const [message, setMessage] = useState<string>("");
    const dispatch = useAppDispatch()
    const handleButton = () => {
     
    }
    return (
        <>
            <section className="w-11/12 h-12 md:hidden flex items-center gap-3">
                <div className="relative flex-1 h-full">
                    <input
                        type="text"
                        className="w-full h-full pl-14 pr-4 outline-none border-none bg-surface-elevated rounded-full text-text-primary placeholder-text-secondary text-sm shadow-sm focus:shadow-md transition-shadow duration-300"
                        placeholder="Ask question . . ."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleButton} className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg cursor-pointer">
                        <Mic size={18} className="text-white" />
                    </button>
                </div>

                <button className="h-full aspect-square rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg cursor-pointer">
                    <Send size={20} className="text-white" />
                </button>
            </section>
        </>
    )
}