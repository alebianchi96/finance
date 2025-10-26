import {ArrowDownUp, LayoutDashboard, Repeat, Settings} from "lucide-react";
import React from "react";

export const navItems = [
    { path: '/', label: 'Dashboard', icon: (classes: string) => { return (<LayoutDashboard className={classes} />) } },
    { path: '/movimenti', label: 'Movimenti', icon: (classes: string) => { return (<ArrowDownUp className={classes} />) } },
    { path: '/trasferimenti', label: 'Trasferimenti', icon: (classes: string) => { return (<Repeat className={classes} />) } },
    { path: '/amministrazione', label: 'Amministrazione', icon: (classes: string) => { return (<Settings className={classes} />) } },
];

