// src/components/layout/Layout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Settings,
    ArrowDownUp,
    Repeat,
    Sun,
    Moon
} from "lucide-react";
import React from "react";

export default function Layout() {
    const location = useLocation();
    const [ theme, setTheme ] = React.useState('dark');

    function changeTheme() {
        //alert(theme)
        setTheme(theme === "dark" ? "light" : "dark");
    }

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
        { path: '/movimenti', label: 'Movimenti', icon: <ArrowDownUp className="w-4 h-4 mr-2" /> },
        { path: '/trasferimenti', label: 'Trasferimenti', icon: <Repeat className="w-4 h-4 mr-2" /> },
        { path: '/amministrazione', label: 'Amministrazione', icon: <Settings className="w-4 h-4 mr-2" /> },
    ];

    return (
        <div className={"min-h-screen bg-background text-foreground flex flex-col " + theme}>
            <header className="border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold flex items-center">
                            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Personal Finance
                        </Link>
                        <nav className="flex space-x-6">
                            {navItems.map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "transition-colors hover:text-primary flex items-center",
                                        location.pathname === item.path && "text-primary font-medium"
                                    )}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={changeTheme}
                                className="p-2 rounded-full hover:bg-muted"
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t border-border py-4">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex justify-center items-center space-x-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                        <path d="M12 17C12.55 17 13 16.55 13 16C13 15.45 12.55 15 12 15C11.45 15 11 15.45 11 16C11 16.55 11.45 17 12 17Z" fill="currentColor"/>
                        <path d="M12 7C10.9 7 10 7.9 10 9H12C12 8.45 12.45 8 13 8C13.55 8 14 8.45 14 9C14 9.55 13.55 10 13 10H12V13H14V11.23C15.25 10.84 16 9.69 16 8.5C16 7.12 14.88 6 13.5 6C13.33 6 13.17 6.02 13 6.05C12.75 6.03 12.38 7 12 7Z" fill="currentColor"/>
                    </svg>
                    <span>&copy; {new Date().getFullYear()} Personal Finance App</span>
                </div>
            </footer>
        </div>
    );
}