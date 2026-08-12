"use client";
import { Loader2, Mic, Search, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";



import Link from "next/link";
import { ChangeGeneralTimeToLocalTimeAndDate } from "../service/changeGeneralTimeToLocalTime";
import { allConversations, fetchConversation } from "../store/conversation";




export default function FilesComponent() {

    const dispatch = useAppDispatch();
    const [search, setSearch] = useState<string>("")

    const conversations = useAppSelector(allConversations)
    const { loading } = useAppSelector((state) => state.conversation);

    useEffect(() => {
        dispatch(fetchConversation({ content: search }))
    }, [])

    return (
        <>
            <section className="w-full h-full flex flex-col ">
                {/* ===== بخش بالایی: جستجو (فقط در دسکتاپ) ===== */}
                <div className="hidden md:block w-full px-4 py-3 border-b border-border">
                    <div className="relative h-12 max-w-2xl">
                        <input
                            type="text"
                            className="w-full h-full pl-12 pr-4 outline-none border-none bg-surface-elevated rounded-full text-text-primary placeholder-text-secondary text-sm shadow-sm focus:shadow-md transition-shadow duration-300"
                            placeholder="Search conversations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    </div>
                </div>


                <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4 custom-scrollbar">
                    {/* نشان دادن تمامی گفتگو های این کاربر با ai*/}

                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4 custom-scrollbar">
                        {loading ? (
                            // حالت ۱: هنوز داره لود می‌شه
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : conversations.length > 0 ? (
                            // حالت ۲: پیام وجود داره
                            conversations.map((val) => (
                                <div key={val.id} className="flex justify-start">
                                    <div className="relative max-w-[85%] md:max-w-[75%] bg-user-bubble dark:bg-[#1E293B] p-3.5 rounded-2xl rounded-bl-none shadow-sm">
                                        <p className="text-text-primary text-sm font-medium leading-relaxed">
                                            {val.title}
                                        </p>
                                        <span className="text-[10px] text-text-secondary mt-1 block text-left">
                                            {ChangeGeneralTimeToLocalTimeAndDate(val.created_at)}
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
                                    you have not been have any conversation until now ??
                                </p>
                                <Link href={"/chat"} className="border-border rounded-2xl bg-primary p-3 mt-3 cursor-pointer hover:bg-primary-hover duration-200">click to start a new conversation</Link>
                            </div>
                        )}
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
        </>
    )
}