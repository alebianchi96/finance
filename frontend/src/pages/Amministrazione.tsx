// src/pages/Amministrazione.tsx
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EconomicCategoryManager from "@/components/amministrazione/EconomicCategoryManager";
import EconomicAccountManager from "@/components/amministrazione/EconomicAccountManager";
import PatrimonialFundManager from "@/components/amministrazione/PatrimonialFundManager";
import PfMenuIcon from "@/components/layout/PfMenuIcon.tsx";
import {navItems} from "@/components/layout/NavBarItemList.tsx";

export default function Amministrazione() {
    const [activeTab, setActiveTab] = useState("categories");

    return (
        <div className="space-y-4 w-full text-foreground">

            <div className="text-xl font-bold flex items-center gap-2 text-primary">
                <PfMenuIcon item={navItems.filter(item=>item.label.toLowerCase()==='amministrazione')[0]} />
                <div>Amministrazione</div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-card">
                    <TabsTrigger className="cursor-pointer" value="categories">Categorie Economiche</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="accounts">Conti Economici</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="funds">Fondi Patrimoniali</TabsTrigger>
                </TabsList>
                <TabsContent value="categories">
                    <EconomicCategoryManager />
                </TabsContent>
                <TabsContent value="accounts">
                    <EconomicAccountManager />
                </TabsContent>
                <TabsContent value="funds">
                    <PatrimonialFundManager />
                </TabsContent>
            </Tabs>
        </div>
    );
}