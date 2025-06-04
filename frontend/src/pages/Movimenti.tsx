// src/pages/Movimenti.tsx
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MovementsTable from "@/components/movimenti/MovementsTable.tsx";
import MovementForm from "@/components/movimenti/MovementForm";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";
import MovementDto from "@/dto/finance/MovementDto";

export default function Movimenti() {
    const [patrimonialFunds, setPatrimonialFunds] = useState<PatrimonialFundDto[]>([]);
    const [selectedFundId, setSelectedFundId] = useState<string>("");
    const [movements, setMovements] = useState<MovementDto[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentMovement, setCurrentMovement] = useState<MovementDto | null>(null);

    // Caricamento dei fondi patrimoniali
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

    // Caricamento dei movimenti quando cambia il fondo selezionato
    useEffect(() => {
        if (!selectedFundId) return;

        const loadMovements = async () => {
            try {
                const response = await fetch(`/api/movements?fundId=${selectedFundId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMovements(data);
                }
            } catch (error) {
                console.error("Errore durante il caricamento dei movimenti:", error);
            }
        };

        loadMovements();
    }, [selectedFundId]);

    const handleAddMovement = () => {
        // Crea un nuovo movimento con il fondo patrimoniale selezionato
        if (!selectedFundId) return;

        const fund = patrimonialFunds.find(f => f.id === parseInt(selectedFundId));
        if (!fund) return;

        const newMovement = new MovementDto();
        newMovement.patrimonialFund = fund;
        newMovement.dt = new Date();

        setCurrentMovement(newMovement);
        setIsFormOpen(true);
    };

    const handleEditMovement = (movement: MovementDto) => {
        setCurrentMovement(movement);
        setIsFormOpen(true);
    };

    const handleDeleteMovement = async (id: number) => {
        try {
            const response = await fetch(`/api/movements/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                // Aggiorna la lista dei movimenti rimuovendo quello eliminato
                setMovements(movements.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error("Errore durante l'eliminazione del movimento:", error);
        }
    };

    const handleSaveMovement = async (movement: MovementDto) => {
        try {
            const url = movement.id ? `/api/movements/${movement.id}` : "/api/movements";
            const method = movement.id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movement)
            });

            if (response.ok) {
                // Ricarica i movimenti per mostrare le modifiche
                const refreshResponse = await fetch(`/api/movements?fundId=${selectedFundId}`);
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    setMovements(data);
                }

                setIsFormOpen(false);
                setCurrentMovement(null);
            }
        } catch (error) {
            console.error("Errore durante il salvataggio del movimento:", error);
        }
    };

    return (
        <div className="space-y-8 w-full bg-background text-foreground">
            <h1 className="text-3xl font-bold">Gestione Movimenti</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Seleziona Fondo Patrimoniale</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Select
                            value={selectedFundId}
                            onValueChange={(value) => setSelectedFundId(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleziona un fondo" />
                            </SelectTrigger>
                            <SelectContent>
                                {patrimonialFunds.map(fund => (
                                    <SelectItem key={fund.id} value={fund.id.toString()}>
                                        {fund.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={handleAddMovement}
                            disabled={!selectedFundId}
                        >
                            Nuovo Movimento
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {selectedFundId && (
                <MovementsTable
                    movements={movements}
                    onEdit={handleEditMovement}
                    onDelete={handleDeleteMovement}
                />
            )}

            {isFormOpen && currentMovement && (
                <MovementForm
                    movement={currentMovement}
                    onSave={handleSaveMovement}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setCurrentMovement(null);
                    }}
                    isOpen={isFormOpen}
                    setIsOpen={setIsFormOpen}
                />
            )}
        </div>
    );
}