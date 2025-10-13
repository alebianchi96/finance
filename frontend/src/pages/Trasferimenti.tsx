// src/pages/Trasferimenti.tsx
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import TransferForm from "@/components/trasferimenti/TransferForm";
import TransferTable from "@/components/trasferimenti/TransferTable";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";
import TransferMovementDto from "@/dto/finance/TransferMovementDto.ts";
import PatrimonialFundService from "@/service/PatrimonialFundService.ts";
import MovementService from "@/service/MovementService.ts";
import DateUtils from "@/lib/DateUtils.ts";

export default function Trasferimenti() {

    const [patrimonialFunds, setPatrimonialFunds] = useState<PatrimonialFundDto[]>([]);
    const [transfers, setTransfers] = useState<TransferMovementDto[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [currentTransfer, setCurrentTransfer] = useState<TransferMovementDto | null>(null);

    const patrimonialFundService = PatrimonialFundService.getInstance();
    const movementService = MovementService.getInstance();


    useEffect(() => {
        movementService.loadTransferMovements(setTransfers);
        patrimonialFundService.load(undefined, setPatrimonialFunds);
    }, []);

    const handleAddTransfer = () => {
        let newTransfer = new TransferMovementDto();
        newTransfer.dt = transfers.reduce(
            (max, m) => m.dt && m.dt > max ? m.dt : max, DateUtils.currentDate()
        );
        setCurrentTransfer(newTransfer);
        setIsFormOpen(true);
    };

    const handleEditTransfer = async (transfer: TransferMovementDto) => {
        setCurrentTransfer(transfer);
        setIsFormOpen(true);
    }

    const saveTransfer = async (transfer: TransferMovementDto) => {
        if(transfer.id) {
            // Aggiorna il movimento esistente
            await movementService.transferEdit(transfer);
        } else {
            // Crea un nuovo movimento
            await movementService.transferInsert(transfer);
        }
        setIsFormOpen(false);
        await movementService.loadTransferMovements(setTransfers);
    }

    const deleteTransfer = async (transfer: TransferMovementDto) => {
        await movementService.transferDelete(transfer.id);
        await movementService.loadTransferMovements(setTransfers);
    }

    return (
        <div className="space-y-8 w-full text-foreground">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Trasferimenti tra Fondi</h1>
                <Button onClick={handleAddTransfer}>Nuovo Trasferimento</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista Trasferimenti</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransferTable
                        transfers={transfers}
                        onEdit={handleEditTransfer}
                        onDelete={deleteTransfer}
                    />
                </CardContent>
            </Card>

            {isFormOpen && currentTransfer && (
                <TransferForm
                    patrimonialFunds={patrimonialFunds}
                    transfer={currentTransfer}
                    onSave={saveTransfer}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setCurrentTransfer(null);
                    }}
                    isOpen={isFormOpen}
                    setIsOpen={setIsFormOpen}
                />
            )}
        </div>
    );
}