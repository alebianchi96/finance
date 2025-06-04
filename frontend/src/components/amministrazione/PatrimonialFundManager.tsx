// src/components/amministrazione/PatrimonialFundManager.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";

export default function PatrimonialFundManager() {
    const [funds, setFunds] = useState<PatrimonialFundDto[]>([]);
    const [open, setOpen] = useState(false);
    const [currentFund, setCurrentFund] = useState<PatrimonialFundDto | null>(null);

    useEffect(() => {
        loadFunds();
    }, []);

    const loadFunds = async () => {
        try {
            const response = await fetch("/api/patrimonial-funds");
            if (response.ok) {
                const data = await response.json();
                setFunds(data);
            }
        } catch (error) {
            console.error("Errore durante il caricamento dei fondi:", error);
        }
    };

    const saveFund = async (fund: PatrimonialFundDto) => {
        try {
            const url = fund.id ? `/api/patrimonial-funds/${fund.id}` : "/api/patrimonial-funds";
            const method = fund.id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fund)
            });

            if (response.ok) {
                setOpen(false);
                loadFunds();
            }
        } catch (error) {
            console.error("Errore durante il salvataggio del fondo:", error);
        }
    };

    const deleteFund = async (id: number) => {
        try {
            const response = await fetch(`/api/patrimonial-funds/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                loadFunds();
            }
        } catch (error) {
            console.error("Errore durante l'eliminazione del fondo:", error);
        }
    };

    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined) return '-';
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Fondi Patrimoniali</h2>
                <Button onClick={() => {
                    setCurrentFund(new PatrimonialFundDto());
                    setOpen(true);
                }}>
                    Nuovo Fondo
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrizione</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                        <TableHead>Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {funds.map(fund => (
                        <TableRow key={fund.id}>
                            <TableCell>{fund.id}</TableCell>
                            <TableCell>{fund.name}</TableCell>
                            <TableCell>{fund.description}</TableCell>
                            <TableCell className="text-right">{formatCurrency(fund.balance)}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setCurrentFund(fund);
                                        setOpen(true);
                                    }}>
                                        Modifica
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteFund(fund.id)}>
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
                        <DialogTitle>{currentFund?.id ? "Modifica" : "Nuovo"} Fondo Patrimoniale</DialogTitle>
                    </DialogHeader>
                    {currentFund && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Nome</label>
                                <Input
                                    value={currentFund.name || ''}
                                    onChange={e => setCurrentFund({...currentFund, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Descrizione</label>
                                <Input
                                    value={currentFund.description || ''}
                                    onChange={e => setCurrentFund({...currentFund, description: e.target.value})}
                                />
                            </div>
                            {!currentFund.id && (
                                <div>
                                    <label className="block text-sm mb-1">Saldo Iniziale</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={currentFund.balance || ''}
                                        onChange={e => setCurrentFund({...currentFund, balance: parseFloat(e.target.value)})}
                                    />
                                </div>
                            )}
                            <DialogFooter>
                                <Button type="submit" onClick={() => saveFund(currentFund)}>
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