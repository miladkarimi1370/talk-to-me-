
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./redux-provider/ReduxProvider";
import SessionProviderForClientComponent from "./sessionProvider/SessionProvider";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "talk to me | chat with your friends",
  description: "talk with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html

      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProviderForClientComponent>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </SessionProviderForClientComponent>





      </body>
    </html>
  );
}
