// src/pages/Amministrazione.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EconomicCategoryManager from "@/components/amministrazione/EconomicCategoryManager";
import EconomicAccountManager from "@/components/amministrazione/EconomicAccountManager";
import PatrimonialFundManager from "@/components/amministrazione/PatrimonialFundManager";

export default function Amministrazione() {
    const [activeTab, setActiveTab] = useState("categories");

    return (
        <div className="space-y-8 w-full bg-background text-foreground">
            <h1 className="text-3xl font-bold mb-6">Amministrazione</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="categories">Categorie Economiche</TabsTrigger>
                    <TabsTrigger value="accounts">Account Economici</TabsTrigger>
                    <TabsTrigger value="funds">Fondi Patrimoniali</TabsTrigger>
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