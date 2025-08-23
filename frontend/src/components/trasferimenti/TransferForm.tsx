// src/components/trasferimenti/TransferForm.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MovementDto from "@/dto/finance/MovementDto";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";
import type TransferMovementDto from "@/dto/finance/TransferMovementDto.ts";
import DateUtils from "@/lib/DateUtils.ts";

interface TransferFormProps {
    patrimonialFunds: PatrimonialFundDto[];
    transfer: TransferMovementDto;
    onSave: (transfer: TransferMovementDto) => void;
    onCancel: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function TransferForm({ patrimonialFunds, transfer, onSave, onCancel, isOpen, setIsOpen }: TransferFormProps) {

    const [formData, setFormData] = useState<TransferMovementDto>({...transfer});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData)
    };

    const handleChange = (field: keyof TransferMovementDto, value: any) => {
        setFormData({...formData, [field]: value});
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {transfer.id ? "Modifica Trasferimento" : "Nuovo Trasferimento"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.dt ? DateUtils.formatDate(formData.dt) : ''}
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
                                value={ formData.amount >= 0 ? formData.amount : '' }
                                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="account">Da:</Label>
                        <Select
                            required
                            value={formData.patrimonialFundFrom?.id.toString()}
                            onValueChange={(value) => {
                                const fund = patrimonialFunds.find(a => a.id === parseInt(value));
                                if (fund) {
                                    handleChange("patrimonialFundFrom", fund);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona un fondo di partenza:" />
                            </SelectTrigger>
                            <SelectContent>
                                {patrimonialFunds.map(fund => (
                                    <SelectItem key={fund.id} value={fund.id.toString()}>
                                        {fund.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="account">A:</Label>
                        <Select
                            required
                            value={formData.patrimonialFundTo?.id.toString()}
                            onValueChange={(value) => {
                                const fund = patrimonialFunds.find(a => a.id === parseInt(value));
                                if (fund) {
                                    handleChange("patrimonialFundTo", fund);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona un fondo di arrivo:" />
                            </SelectTrigger>
                            <SelectContent>
                                {patrimonialFunds.map(fund => (
                                    <SelectItem key={fund.id} value={fund.id.toString()}>
                                        {fund.label}
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