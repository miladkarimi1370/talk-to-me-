"use client";

import { Mic, Send, Search, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ChangeGeneralTimeToLocalTime } from "../service/changeGeneralTimeToLocalTime";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { chatNewMessage, fetchMessages, selectAllMessages } from "../store/chatSlice";
import { setNewConversation } from "../store/conversation";






export default function MessageList() {
    const [chat, setChat] = useState<string>("");
    const dispatch = useAppDispatch();

    const [search, setSearch] = useState<string>("");
    const selector = useAppSelector((state) => state.chat);
    const messages = useAppSelector(selectAllMessages);

    const aiHandler = async (message: string) => {
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ chat: message })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "AI request failed");
            }

            const data = await res.json();
            console.log("AI Reply:", data.reply);
            return data.reply;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    const buttonHandler = async () => {
        const userMessage = chat.trim();
        if (!userMessage) return;

        const firstId = selector.ids[0];
        let conversation_id = firstId
            ? selector.entities[firstId]?.conversation_id
            : undefined;

        try {
    
            if (!conversation_id) {
                const newConversation = await dispatch(
                    setNewConversation({ title: userMessage })
                ).unwrap();
                conversation_id = newConversation.id;
            }

       
            await dispatch(
                chatNewMessage({
                    content: userMessage,
                    conversation_id,
                    role: "user",
                })
            ).unwrap();

            setChat("");

      
            const aiReply = await aiHandler(userMessage);


            if (aiReply) {
                await dispatch(
                    chatNewMessage({
                        content: aiReply,
                        conversation_id,
                        role: "assistant",
                    })
                ).unwrap();
            }
        } catch (error) {
            console.error("Error in buttonHandler:", error);
        }
    };


    useEffect(() => {

        dispatch(fetchMessages({ content: search }))



    }, [search]);
    return (
        <section className="w-full h-full flex flex-col ">
            {/* ===== بخش بالایی: جستجو (فقط در دسکتاپ) ===== */}
            <div className="hidden md:block w-full px-4 py-3 border-b border-border">
                <div className="relative h-12 max-w-2xl">
                    <input
                        type="text"
                        className="w-full h-full pl-12 pr-4 outline-none border-none bg-surface-elevated rounded-full text-text-primary placeholder-text-secondary text-sm shadow-sm focus:shadow-md transition-shadow duration-300"
                        placeholder="Search messages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                </div>
            </div>

            {/* ===== بخش میانی: لیست پیام‌ها ===== */}

            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4 custom-scrollbar">
                {selector.loading ? (
                    // حالت ۱: هنوز داره لود می‌شه
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : messages.length > 0 ? (
                    // حالت ۲: پیام وجود داره
                    messages.map((val) => (
                        <div key={val.id} className="flex justify-start">
                            <div className="relative max-w-[85%] md:max-w-[75%] bg-user-bubble dark:bg-[#1E293B] p-3.5 rounded-2xl rounded-bl-none shadow-sm">
                                <p className="text-text-primary text-sm font-medium leading-relaxed">
                                    {val.content}
                                </p>
                                <span className="text-[10px] text-text-secondary mt-1 block text-left">
                                    {ChangeGeneralTimeToLocalTime(val.created_at)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    // حالت ۳: لود تموم شده و هیچ پیامی نیست
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        <h2 className="text-xl font-semibold text-primary mb-2">
                            Hi 👋
                        </h2>
                        <p className="text-text-secondary text-sm">
                            Ask your questions to start conversation !
                        </p>
                    </div>
                )}
            </div>






            {/* پیام کاربر */}
            {/* <div className="flex justify-start">
                    <div className="relative max-w-[85%] md:max-w-[75%] bg-user-bubble dark:bg-[#1E293B] p-3.5 rounded-2xl rounded-bl-none shadow-sm">
                        <p className="text-text-primary text-sm font-medium leading-relaxed">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, aperiam!
                        </p>
                        <span className="text-[10px] text-text-secondary mt-1 block text-left">
                            11:11
                        </span>
                    </div>
                </div> */}

            {/* پیام AI */}
            {/* <div className="flex justify-end">
                    <div className="relative max-w-[85%] md:max-w-[75%] bg-primary text-white p-3.5 rounded-2xl rounded-br-none shadow-md">
                        <p className="text-sm font-medium leading-relaxed">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas libero nesciunt voluptatum suscipit ipsa veritatis magni, quidem ipsam soluta quis quaerat inventore repudiandae explicabo obcaecati sed? Repellat veritatis eum voluptatum, iusto fugiat minima necessitatibus deleniti odit, cumque delectus odio neque velit consequuntur id soluta vitae iure explicabo quos, beatae ipsum!
                        </p>
                        <span className="text-[10px] text-white/70 mt-1 block text-right">
                            12:05
                        </span>
                    </div>
                </div> */}




            {/* جداکننده تاریخ */}
            {/* <div className="flex justify-center">
                    <div className="bg-surface-elevated text-text-secondary text-xs px-4 py-1.5 rounded-full">
                        Today 12:00 PM
                    </div>
                </div> */}






            {/* ===== بخش پایینی: ورودی چت ===== */}
            <div className="w-full px-4 py-3 border-t border-border bg-background/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto flex items-center gap-3 h-12">
                    <div className="relative flex-1 h-full">
                        <input
                            type="text"
                            className="w-full h-full pl-14 pr-4 outline-none border-none bg-surface-elevated rounded-full text-text-primary placeholder-text-secondary text-sm shadow-sm focus:shadow-md transition-shadow duration-300"
                            placeholder="Ask question . . ."
                            value={chat}
                            onChange={(e) => setChat(e.target.value)}
                        />
                        <button className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg cursor-pointer">
                            <Mic size={18} className="text-white" />
                        </button>
                    </div>

                    <button
                        onClick={buttonHandler}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                buttonHandler();
                            }
                        }}
                        className="h-full aspect-square rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg cursor-pointer">
                        <Send size={20} className="text-white" />
                    </button>
                </div>
            </div>

            {/* استایل اسکرول بار */}
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