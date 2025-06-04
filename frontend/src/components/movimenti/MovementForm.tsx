// src/components/movimenti/MovementForm.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MovementDto from "@/dto/finance/MovementDto";
import EconomicAccountDto from "@/dto/finance/EconomicAccountDto";

interface MovementFormProps {
    movement: MovementDto;
    onSave: (movement: MovementDto) => void;
    onCancel: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function MovementForm({ movement, onSave, onCancel, isOpen, setIsOpen }: MovementFormProps) {
    const [formData, setFormData] = useState<MovementDto>({...movement});
    const [economicAccounts, setEconomicAccounts] = useState<EconomicAccountDto[]>([]);

    // Caricamento degli account economici
    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const response = await fetch("/api/economic-accounts");
                if (response.ok) {
                    const data = await response.json();
                    setEconomicAccounts(data);
                }
            } catch (error) {
                console.error("Errore durante il caricamento degli account economici:", error);
            }
        };

        loadAccounts();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field: keyof MovementDto, value: any) => {
        setFormData({...formData, [field]: value});
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {movement.id ? "Modifica Movimento" : "Nuovo Movimento"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.dt ? new Date(formData.dt).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleChange('dt', new Date(e.target.value))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Importo</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={formData.amount || ''}
                                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="account">Account Economico</Label>
                        <Select
                            value={formData.economicAccount?.id?.toString()}
                            onValueChange={(value) => {
                                const account = economicAccounts.find(a => a.id === parseInt(value));
                                if (account) {
                                    handleChange('economicAccount', account);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona un account economico" />
                            </SelectTrigger>
                            <SelectContent>
                                {economicAccounts.map(account => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                        {account.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Note</Label>
                        <Input
                            id="note"
                            value={formData.note || ''}
                            onChange={(e) => handleChange('note', e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Annulla
                        </Button>
                        <Button type="submit">Salva</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}