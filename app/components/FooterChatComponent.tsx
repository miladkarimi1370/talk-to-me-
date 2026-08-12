import { Files, Globe, House, User, Users } from "lucide-react";
import Link from "next/link";

export default function FooterChatComponent() {
    return (
        <>
            <footer className="w-11/12 h-14 md:hidden rounded-2xl bg-surface-elevated shadow-md mt-2">
                <nav className="w-full h-full">
                    <ul className="w-full h-full flex items-center justify-around">
                        {[
                            { href: "/", icon: House, label: "home" },
                            { href: "/chat", icon: Users, label: "chat" },
                            { href: "/files", icon: Files, label: "files" },
                            { href: "/agents", icon: Globe, label: "agents" },
                            { href: "/profile", icon: User, label: "profile" },
                        ].map(({ href, icon: Icon, label }) => (
                            <li key={href} className="flex-1 h-full">
                                <Link
                                    href={href}
                                    className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-text-secondary hover:text-primary transition-all duration-300 group relative"
                                >
                                    <Icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-[10px] font-medium capitalize group-hover:text-primary transition-colors">
                                        {label}
                                    </span>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-4 transition-all duration-300"></div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </footer>
        </>
    )
}