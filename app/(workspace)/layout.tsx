
// app/chat/layout.tsx
import HeaderChatComponent from "../components/HeaderChatComponent";
import RightSidebar from "../components/RightSidebar";

import "react-toastify/dist/ReactToastify.css";
export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

            <main className="bg-background w-screen h-screen overflow-hidden">
                {/* هدر و سایدبار چپ fixed */}
                <HeaderChatComponent />

                {/* محتوای اصلی با padding مناسب */}
                <div className="w-full h-full">
                    {/* فاصله برای هدر موبایل */}
                    <div className="h-16 md:hidden"></div>

                    {/* محتوای دسکتاپ با دو سایدبار */}
                    <div className="hidden md:flex md:ml-[25%] h-full">
                        {/* بخش اصلی (چت) - flex-1 باعث میشه فضای باقی‌مانده رو پر کنه */}
                        <div className="flex-1 h-full overflow-hidden">
                            {children}
                        </div>

                        {/* سایدبار راست (۱/۱۲) - به لبه سمت راست می‌چسبد */}
                        <RightSidebar />
                    </div>

                    {/* محتوای موبایل */}
                    <div className="md:hidden h-[calc(100%-4rem)]">
                        {children}
                    </div>
                </div>
            </main>


    );
}