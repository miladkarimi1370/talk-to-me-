import HeaderChatComponent from "../components/HeaderChatComponent";
import MobileHeader from "../components/MobileHeader";
import RightSidebar from "../components/RightSidebar";
import "react-toastify/dist/ReactToastify.css";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* هدر و drawer موبایل */}
      <MobileHeader />

      <main className="bg-background w-screen h-screen overflow-hidden">
        {/* سایدبار دسکتاپ */}
        <HeaderChatComponent />

        <div className="w-full h-full">
          <div className="h-16 md:hidden" />
          <div className="hidden md:flex md:ml-[25%] h-full">
            <div className="flex-1 h-full overflow-hidden">{children}</div>
            <RightSidebar />
          </div>
          <div className="md:hidden h-[calc(100%-4rem)]">{children}</div>
        </div>
      </main>
    </>
  );
}