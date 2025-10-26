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
import DateUtils from "@/lib/DateUtils.ts";
import Logo from "@/svg/Logo.tsx";
import PfNavBar from "@/components/layout/PfNavBar.tsx";

export default function Layout() {
    const location = useLocation();
    const [ theme, setTheme ] = React.useState('dark');

    function changeTheme() {
        //alert(theme)
        setTheme(theme === "dark" ? "light" : "dark");
    }


    return (
        <div className={"min-h-screen bg-background text-foreground flex flex-col " + theme}>

            <PfNavBar theme={theme} changeTheme={changeTheme} />

            <main className="flex-1 container mx-auto mt-2 px-4 py-4">
                <Outlet />
            </main>

            <footer className="border-t border-border py-4">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex justify-center items-center space-x-2">
                    <Logo />
                    <span>&copy; {DateUtils.currentYearAsString()} Personal Finance App</span>
                </div>
            </footer>
        </div>
    );
}