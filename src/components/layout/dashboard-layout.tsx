import { useEffect, useState } from "react";
import { MenuIcon, MessageSquareText } from "lucide-react";
import Sidebar from "../shared/sidebar";
import Header from "../shared/header";
import MobileSidebar from "../shared/mobile-sidebar";
import MobileLivechat from "../shared/mobile-livechat";
import LiveChat from "../shared/live-chat";
import { useOpen } from "@/provider/chat-provider";
import { useAppDispatch } from "@/store/redux";
import { getAccessToken } from "@/utils/axios";
import { paymentActions } from "@/store/redux/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [liveChatOpen, setLiveChatOpen] = useState<boolean>(false);
  const { open } = useOpen();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(paymentActions.loginPaymentServer());
  }, [getAccessToken()]);

  useEffect(() => {
    dispatch(paymentActions.subscribePaymentServer());
  }, []);
  return (
    <div className="flex h-screen bg-opacity-90 bg-gradient-to-b from-dark-0.7 to-dark bg-blend-multiply">
      <div className="absolute z-20 flex h-full w-full items-center justify-center backdrop-blur-lg lg:hidden">
        <p className="text-center text-2xl font-bold text-white">
          This application is only available on PC
        </p>
      </div>
      <div className='absolute left-0 top-0 -z-10 h-full w-full bg-[url("/assets/bg-01.png")] bg-cover bg-top bg-no-repeat bg-blend-multiply' />
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex h-16 flex-shrink-0 shadow">
          <button
            className="h-full bg-dark bg-opacity-30 px-4 text-gray-300 bg-blend-multiply focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Header />
        </div>
        <main className="flex flex-row justify-between focus:outline-none">
          <div className="flex-1">{children}</div>
          <MobileLivechat
            livechatOpen={liveChatOpen}
            setLivechatOpen={setLiveChatOpen}
          />
          <div
            className={`hidden transform shadow-lg shadow-purple-0.15 transition-all duration-300 ease-in-out 2xl:flex ${open ? "w-[278px] translate-x-0 opacity-100" : "w-0 translate-x-full opacity-0"}`}
          >
            <LiveChat />
          </div>
          <MessageSquareText
            className="fixed bottom-8 right-8 z-50 block h-14 w-14 cursor-pointer rounded-full bg-gray50 bg-opacity-15 p-3 text-lg text-gray50 bg-blend-multiply shadow-lg 2xl:hidden "
            onClick={() => setLiveChatOpen(true)}
          />
        </main>
      </div>
    </div>
  );
}
