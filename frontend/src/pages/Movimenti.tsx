// src/pages/Movimenti.tsx
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MovementsTable from "@/components/movimenti/MovementsTable.tsx";
import MovementForm from "@/components/movimenti/MovementForm";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";
import MovementDto from "@/dto/finance/MovementDto";
import PatrimonialFundService from "@/service/PatrimonialFundService.ts";
import MovementService from "@/service/MovementService.ts";
import CurrencyEur from "@/lib/CurrencyEur.ts";

export default function Movimenti() {

    const [patrimonialFunds, setPatrimonialFunds] = useState<PatrimonialFundDto[]>([]);
    const [selectedFundId, setSelectedFundId] = useState<string>("");
    const [selectedFundAmount, setSelectedFundAmount] = useState<number>(0);

    const [selectedNature, setSelectedNature] = useState<"C" | "R">("C"); // Costo o Ricavo

    const [movements, setMovements] = useState<MovementDto[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentMovement, setCurrentMovement] = useState<MovementDto | null>(null);

    const patrimonialFundService = PatrimonialFundService.getInstance();
    const movementService = MovementService.getInstance();

    // Caricamento dei fondi patrimoniali
    useEffect(() => {
        patrimonialFundService.load("", setPatrimonialFunds);
    }, []);

    // Caricamento dei movimenti quando cambia il fondo selezionato
    useEffect(() => {
        if (!selectedFundId) return;
        movementService.loadMovementsByPatrimonialFundAndType(selectedFundId, "economics",  setMovements);
        patrimonialFundService.fundAmountByIdAtDate(selectedFundId, new Date(), setSelectedFundAmount);
    }, [selectedFundId]);

    // @type IN C | R
    const handleAddMovement = (type:'C'|'R') => {
        // Crea un nuovo movimento con il fondo patrimoniale selezionato
        if (!selectedFundId) return;

        const fund = patrimonialFunds.find(f => f.id === parseInt(selectedFundId));
        if (!fund) return;

        const newMovement = new MovementDto();
        newMovement.patrimonialFund = fund;

        // la data e' la massima presente in movements altrimenti la data attuale
        newMovement.dt = movements.reduce((max, m) => m.dt && m.dt > max ? m.dt : max, new Date());

        newMovement.blockId = new Date().getTime();

        setSelectedNature(type)
        setCurrentMovement(newMovement);
        setIsFormOpen(true);
    };

    const handleEditMovement = (movement: MovementDto) => {
        setSelectedNature(movement.economicAccount.economicCategory.nature === 'C' ? 'C' : 'R');
        setCurrentMovement(movement);
        setIsFormOpen(true);
    };

    const deleteMovement = async (id: number) => {
        await movementService.delete(id);
        movementService.loadMovementsByPatrimonialFundAndType(selectedFundId, "economics",  setMovements);
    };

    const saveMovement = async (movement: MovementDto) => {

        // che natura ha il movimento
        const nature = movement.economicAccount?.economicCategory?.nature;
        if((nature=== 'C' && movement.amount > 0)
            || (nature === 'R' && movement.amount < 0)) {
            // i costi sono negativi
            // i ricavi sono positivi
            movement.amount = (movement.amount)*(-1);
        }

        if(movement.id) {
            // Aggiorna il movimento esistente
            await movementService.edit(movement);
        } else {
            // Crea un nuovo movimento
            await movementService.insert(movement);
        }
        setIsFormOpen(false);
        await movementService.loadMovementsByPatrimonialFundAndType(selectedFundId, "economics",  setMovements);
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
                                        <div style={{
                                            borderRadius:'50px',
                                            width:'30px',
                                            height:'30px'
                                        }}
                                             className={
                                                 `text-white font-medium flex items-center justify-center bg-blue-600`
                                             }>
                                            F
                                        </div>
                                        <div>
                                            {fund.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={()=>handleAddMovement('C')}
                            disabled={!selectedFundId}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-4 text-white font-medium h-4 rounded-full bg-red-600`}></div>
                                <span className="font-medium">
                                    Aggiungi Costo
                                </span>
                            </div>
                        </Button>
                        <Button
                            onClick={()=>handleAddMovement('R')}
                            disabled={!selectedFundId}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-4 text-white font-medium h-4 rounded-full bg-green-600`}></div>
                                <span className="font-medium">
                                    Aggiungi Ricavo
                                </span>
                            </div>
                        </Button>

                    </div>
                    <div className="mt-4 flex gap-4">
                        <p>
                            <strong>
                                Importo attuale:
                            </strong> {CurrencyEur.getInstance().format(selectedFundAmount)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {selectedFundId && (
                <MovementsTable
                    movements={movements}
                    onEdit={handleEditMovement}
                    onDelete={deleteMovement}
                />
            )}

            {isFormOpen && currentMovement && (
                <MovementForm
                    movement={currentMovement}
                    onSave={saveMovement}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setCurrentMovement(null);
                    }}
                    isOpen={isFormOpen}
                    setIsOpen={setIsFormOpen}
                    nature={selectedNature}
                />
            )}
        </div>
    );
}