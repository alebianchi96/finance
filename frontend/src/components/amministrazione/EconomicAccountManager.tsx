// src/components/amministrazione/EconomicAccountManager.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EconomicAccountDto from "@/dto/finance/EconomicAccountDto";
import EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto";

export default function EconomicAccountManager() {
    const [accounts, setAccounts] = useState<EconomicAccountDto[]>([]);
    const [categories, setCategories] = useState<EconomicCategoryDto[]>([]);
    const [open, setOpen] = useState(false);
    const [currentAccount, setCurrentAccount] = useState<EconomicAccountDto | null>(null);

    useEffect(() => {
        loadAccounts();
        loadCategories();
    }, []);

    const loadAccounts = async () => {
        try {
            const response = await fetch("/api/economic-accounts");
            if (response.ok) {
                const data = await response.json();
                setAccounts(data);
            }
        } catch (error) {
            console.error("Errore durante il caricamento degli account:", error);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch("/api/economic-categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Errore durante il caricamento delle categorie:", error);
        }
    };

    const saveAccount = async (account: EconomicAccountDto) => {
        try {
            const url = account.id ? `/api/economic-accounts/${account.id}` : "/api/economic-accounts";
            const method = account.id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(account)
            });

            if (response.ok) {
                setOpen(false);
                loadAccounts();
            }
        } catch (error) {
            console.error("Errore durante il salvataggio dell'account:", error);
        }
    };

    const deleteAccount = async (id: number) => {
        try {
            const response = await fetch(`/api/economic-accounts/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                loadAccounts();
            }
        } catch (error) {
            console.error("Errore durante l'eliminazione dell'account:", error);
        }
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Account Economici</h2>
                <Button onClick={() => {
                    setCurrentAccount(new EconomicAccountDto());
                    setOpen(true);
                }}>
                    Nuovo Account
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrizione</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.map(account => (
                        <TableRow key={account.id}>
                            <TableCell>{account.id}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.description}</TableCell>
                            <TableCell>{account.economicCategory?.name || 'N/D'}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setCurrentAccount(account);
                                        setOpen(true);
                                    }}>
                                        Modifica
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteAccount(account.id)}>
                                        Elimina
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentAccount?.id ? "Modifica" : "Nuovo"} Account Economico</DialogTitle>
                    </DialogHeader>
                    {currentAccount && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Nome</label>
                                <Input
                                    value={currentAccount.name || ''}
                                    onChange={e => setCurrentAccount({...currentAccount, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Descrizione</label>
                                <Input
                                    value={currentAccount.description || ''}
                                    onChange={e => setCurrentAccount({...currentAccount, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Categoria Economica</label>
                                <Select
                                    value={currentAccount.economicCategory?.id?.toString()}
                                    onValueChange={(value) => {
                                        const category = categories.find(c => c.id === parseInt(value));
                                        setCurrentAccount({...currentAccount, economicCategory: category || null});
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona una categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => saveAccount(currentAccount)}>
                                    Salva
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}