// src/components/trasferimenti/TransferForm.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MovementDto from "@/dto/finance/MovementDto";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";

interface TransferFormProps {
    transfer: {
        sourceMovement: MovementDto;
        destinationMovement: MovementDto;
    };
    onSave: (transfer: {
        sourceMovement: MovementDto;
        destinationMovement: MovementDto;
    }) => void;
    onCancel: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function TransferForm({ transfer, onSave, onCancel, isOpen, setIsOpen }: TransferFormProps) {
    const [formData, setFormData] = useState(transfer);
    const [patrimonialFunds, setPatrimonialFunds] = useState<PatrimonialFundDto[]>([]);
    const [amount, setAmount] = useState<string>(
        transfer.sourceMovement.amount ? Math.abs(transfer.sourceMovement.amount).toString() : ''
    );
    const [transferDate, setTransferDate] = useState<string>(
        transfer.sourceMovement.dt
            ? new Date(transfer.sourceMovement.dt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
    );

    useEffect(() => {
        const loadFunds = async () => {
            try {
                const response = await fetch("/api/patrimonial-funds");
                if (response.ok) {
                    const data = await response.json();
                    setPatrimonialFunds(data);
                }
            } catch (error) {
                console.error("Errore durante il caricamento dei fondi:", error);
            }
        };

        loadFunds();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Assicurati che gli importi abbiano il segno corretto
        const transferAmount = parseFloat(amount);
        const updatedFormData = {
            sourceMovement: {
                ...formData.sourceMovement,
                dt: new Date(transferDate),
                amount: -transferAmount // importo negativo per il fondo di origine
            },
            destinationMovement: {
                ...formData.destinationMovement,
                dt: new Date(transferDate),
                amount: transferAmount // importo positivo per il fondo di destinazione
            }
        };

        onSave(updatedFormData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {transfer.sourceMovement.id ? "Modifica Trasferimento" : "Nuovo Trasferimento"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                            id="date"
                            type="date"
                            value={transferDate}
                            onChange={(e) => setTransferDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sourceFund">Da Fondo</Label>
                        <Select
                            value={formData.sourceMovement.patrimonialFund?.id?.toString()}
                            onValueChange={(value) => {
                                const fund = patrimonialFunds.find(f => f.id === parseInt(value));
                                if (fund) {
                                    setFormData({
                                        ...formData,
                                        sourceMovement: {
                                            ...formData.sourceMovement,
                                            patrimonialFund: fund
                                        }
                                    });
                                }
                            }}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona il fondo di origine" />
                            </SelectTrigger>
                            <SelectContent>
                                {patrimonialFunds.map(fund => (
                                    <SelectItem key={fund.id} value={fund.id.toString()}>
                                        {fund.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="destinationFund">A Fondo</Label>
                        <Select
                            value={formData.destinationMovement.patrimonialFund?.id?.toString()}
                            onValueChange={(value) => {
                                const fund = patrimonialFunds.find(f => f.id === parseInt(value));
                                if (fund) {
                                    setFormData({
                                        ...formData,
                                        destinationMovement: {
                                            ...formData.destinationMovement,
                                            patrimonialFund: fund
                                        }
                                    });
                                }
                            }}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona il fondo di destinazione" />
                            </SelectTrigger>
                            <SelectContent>
                                {patrimonialFunds.map(fund => (
                                    <SelectItem key={fund.id} value={fund.id.toString()}>
                                        {fund.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Importo</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Note</Label>
                        <Input
                            id="note"
                            value={formData.sourceMovement.note || ''}
                            onChange={(e) => {
                                const note = e.target.value;
                                setFormData({
                                    sourceMovement: { ...formData.sourceMovement, note },
                                    destinationMovement: { ...formData.destinationMovement, note }
                                });
                            }}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Annulla
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !formData.sourceMovement.patrimonialFund ||
                                !formData.destinationMovement.patrimonialFund ||
                                !amount ||
                                formData.sourceMovement.patrimonialFund.id === formData.destinationMovement.patrimonialFund.id
                            }
                        >
                            Salva
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}