// src/pages/Trasferimenti.tsx
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransferForm from "@/components/trasferimenti/TransferForm";
import TransferTable from "@/components/trasferimenti/TransferTable";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";
import MovementDto from "@/dto/finance/MovementDto";

export default function Trasferimenti() {
    const [transfers, setTransfers] = useState<MovementDto[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentTransfer, setCurrentTransfer] = useState<{
        sourceMovement: MovementDto;
        destinationMovement: MovementDto;
    } | null>(null);

    useEffect(() => {
        loadTransfers();
    }, []);

    const loadTransfers = async () => {
        try {
            const response = await fetch("/api/transfers");
            if (response.ok) {
                const data = await response.json();
                setTransfers(data);
            }
        } catch (error) {
            console.error("Errore durante il caricamento dei trasferimenti:", error);
        }
    };

    const handleAddTransfer = () => {
        setCurrentTransfer({
            sourceMovement: new MovementDto(),
            destinationMovement: new MovementDto()
        });
        setIsFormOpen(true);
    };

    const handleEditTransfer = (transferId: number) => {
        // In una situazione reale, qui dovremmo caricare i dettagli del trasferimento specifico
        fetch(`/api/transfers/${transferId}`)
            .then(res => res.json())
            .then(data => {
                setCurrentTransfer(data);
                setIsFormOpen(true);
            });
    };

    const handleDeleteTransfer = async (id: number) => {
        try {
            const response = await fetch(`/api/transfers/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                loadTransfers();
            }
        } catch (error) {
            console.error("Errore durante l'eliminazione del trasferimento:", error);
        }
    };

    const handleSaveTransfer = async (transfer: {
        sourceMovement: MovementDto;
        destinationMovement: MovementDto;
    }) => {
        try {
            const response = await fetch("/api/transfers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transfer)
            });

            if (response.ok) {
                setIsFormOpen(false);
                setCurrentTransfer(null);
                loadTransfers();
            }
        } catch (error) {
            console.error("Errore durante il salvataggio del trasferimento:", error);
        }
    };

    return (
        <div className="space-y-8 w-full bg-background text-foreground">
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
                        onDelete={handleDeleteTransfer}
                    />
                </CardContent>
            </Card>

            {isFormOpen && currentTransfer && (
                <TransferForm
                    transfer={currentTransfer}
                    onSave={handleSaveTransfer}
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