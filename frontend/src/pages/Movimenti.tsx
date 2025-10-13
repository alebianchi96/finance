// src/pages/Movimenti.tsx
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import MovementsTable from "@/components/movimenti/MovementsTable.tsx";
import MovementForm from "@/components/movimenti/MovementForm";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";
import MovementDto from "@/dto/finance/MovementDto";
import PatrimonialFundService from "@/service/PatrimonialFundService.ts";
import MovementService from "@/service/MovementService.ts";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import DateUtils from "@/lib/DateUtils.ts";
import type PaginationData from "@/dto/finance/pagination/PaginationData.ts";
import {
    DEFAULT_PAGINATION_DATA,
    DISABLED_BTN_CLASS,
    isActivePrevButton,
    isActiveSuccButton
} from "@/dto/finance/pagination/PaginationUtils.ts";
import PaginationComponent from "@/components/movimenti/pagination/PaginationComponent.tsx";
import PatrimonialFundSelector from "@/components/movimenti/PatrimonialFundSelector.tsx";


export default function Movimenti() {

    const patrimonialFundService = PatrimonialFundService.getInstance();
    const movementService = MovementService.getInstance();

    const [patrimonialFunds, setPatrimonialFunds] = useState<PatrimonialFundDto[]>([]);
    const [selectedFundId, setSelectedFundId] = useState<string>("");
    const [selectedFundAmount, setSelectedFundAmount] = useState<number>(0);

    const [selectedNature, setSelectedNature] = useState<"C" | "R">("C"); // Costo o Ricavo

    const [movements, setMovements] = useState<MovementDto[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentMovement, setCurrentMovement] = useState<MovementDto | null>(null);

    // ------------- pagination state -------------
        const [paginationData, setPaginationData] = useState<PaginationData>(DEFAULT_PAGINATION_DATA);
        async function changePage( variationNumber: number ) {
            let currentPage = paginationData?.currentPage ?? 0;
            setPaginationData((e : PaginationData)=>{ e.currentPage = currentPage+variationNumber; return e; });
            await movementService.loadEconomicMovementsByPatrimonialFund(selectedFundId, setMovements, { paginationData, setPaginationData });
        }
        async function addPage() { await changePage( 1); }
        async function subtractPage() { await changePage( -1); }
    // --------------------------------------------

    // Caricamento dei fondi patrimoniali
    useEffect(() => {
        patrimonialFundService.load("", setPatrimonialFunds);
    }, []);

    // Caricamento dei movimenti quando cambia il fondo selezionato
    useEffect(() => {
        if (!selectedFundId) return;
        movementService.loadEconomicMovementsByPatrimonialFund(selectedFundId, setMovements, { paginationData:DEFAULT_PAGINATION_DATA, setPaginationData });
        patrimonialFundService.fundAmountByIdAtDate(selectedFundId, DateUtils.currentDate(), setSelectedFundAmount);
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
        newMovement.dt = movements.reduce((max, m) => m.dt && m.dt > max ? m.dt : max, DateUtils.currentDate());

        newMovement.blockId = DateUtils.createBlockId();

        setSelectedNature(type)
        setCurrentMovement(newMovement);
        setIsFormOpen(true);
    };

    const handleEditMovement = (movement: MovementDto) => {
        setSelectedNature(movement.economicAccount.economicCategory.nature === 'C' ? 'C' : 'R');
        setCurrentMovement(movement);
        setIsFormOpen(true);
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
        await movementService.loadEconomicMovementsByPatrimonialFund(selectedFundId, setMovements, { paginationData, setPaginationData });
        await patrimonialFundService.fundAmountByIdAtDate(selectedFundId, DateUtils.currentDate(), setSelectedFundAmount);
    };

    const deleteMovement = async (id: number) => {
        await movementService.delete(id);
        let paginationToUse = paginationData;
        if( movements && movements.length == 1 ) {
            paginationToUse = DEFAULT_PAGINATION_DATA
        }
        await movementService.loadEconomicMovementsByPatrimonialFund(selectedFundId, setMovements, { paginationData:paginationToUse, setPaginationData });
        await patrimonialFundService.fundAmountByIdAtDate(selectedFundId, DateUtils.currentDate(), setSelectedFundAmount);
    };

    return (
        <div className="space-y-8 w-full text-foreground">
            <h1 className="text-3xl font-bold">Gestione Movimenti</h1>

            <PatrimonialFundSelector
                patrimonialFunds={patrimonialFunds}
                selectedFundId={selectedFundId}
                selectedFundAmount={selectedFundAmount}
                setSelectedFundId={setSelectedFundId}
                handleAddMovement={handleAddMovement}
            />

            <PaginationComponent
                movements={movements}
                paginationData={paginationData}
                addPage={addPage}
                subtractPage={subtractPage}
            />

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

            <PaginationComponent
                movements={movements}
                paginationData={paginationData}
                addPage={addPage}
                subtractPage={subtractPage}
            />

        </div>
    );
}