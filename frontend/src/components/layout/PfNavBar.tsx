import {Link} from "react-router-dom";
import {cn} from "@/lib/utils.ts";
import {ArrowDownUp, LayoutDashboard, Moon, Repeat, Settings, Sun} from "lucide-react";
import React from "react";
import Logo from "@/svg/Logo.tsx";
import {navItems} from "@/components/layout/NavBarItemList.tsx";
import PfMenuIcon from "@/components/layout/PfMenuIcon.tsx";

export default function PfNavBar (
    {
        theme, changeTheme
    } : {
        theme: string,
        changeTheme: () => void
    }
) {

    const [ menuOpened, setMenuOpened ] = React.useState(true);

    const [position, setPosition] = React.useState({ x: window.innerWidth/2, y: 20});
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        });
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (isDragging) {
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        const updateCenter = () => {
            setPosition(prev => ({ ...prev, x: window.innerWidth / 2 }));
        };

        // centra subito e poi ad ogni ridimensionamento
        updateCenter();
        window.addEventListener('resize', updateCenter);
        return () => window.removeEventListener('resize', updateCenter);
    }, []);

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, dragStart]);

    const toggleMenu = () => {
        // Implement menu toggle logic if needed

        setMenuOpened((ex)=>{
            // console.log(ex);
            return !ex
        });
    };

    return (
        <div className={"px-4 py-2 bg-card relative mb-2" +
            //" fixed z-[9999] cursor-move  bg-secondary " +
            " rounded-lg w-fit shadow-lg  " +
            " flex gap-4"}
             style={{
                 left: `${position.x}px`,
                 top: `${position.y}px`,
                 transform: 'translateX(-50%)'
             }}
        >
            <div className={"flex justify-between items-center"}
                // onMouseDown={handleMouseDown}
                //onTouchStart={handleTouchStart}
            >
                <button
                    onClick={toggleMenu}
                    className="rounded-full cursor-pointer hover:bg-primary mr-2 p-2">
                    <Logo />
                </button>
                <div>Personal Finance</div>
            </div>
            <div className={"flex items-center gap-2 transition-shadow " + (menuOpened ? "block" : "hidden")}>
                {navItems.map(item => (
                    <Link title={item.label} key={item.path} to={item.path} className={"px-2"}>
                        <PfMenuIcon item={item} />
                    </Link>
                ))}
                <button
                    onClick={changeTheme}
                    className="rounded-full cursor-pointer hover:bg-primary hover:text-white p-2"
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5" />
                    ) : (
                        <Moon className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    )



}