// src/components/amministrazione/PatrimonialFundManager.tsx
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";
import PatrimonialFundService from "@/service/PatrimonialFundService.ts";
import {Edit, Filter, Trash} from "lucide-react";
import type PatrimonialFundInitDto from "@/dto/finance/PatrimonialFundInitDto.ts";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import MovementDto from "@/dto/finance/MovementDto.ts";
import {Label} from "@/components/ui/label.tsx";
import DateUtils from "@/lib/DateUtils.ts";
import MovementService from "@/service/MovementService.ts";
import Constants from "@/constants/Constants.ts";
import BulletNature from "@/components/common/bullet/BulletNature.tsx";
import CategoryNature from "@/components/common/bullet/CategoryNature.ts";

export default function PatrimonialFundManager() {

    const [funds, setFunds] = useState<PatrimonialFundInitDto[]>([]);
    const [open, setOpen] = useState(false);
    const [currentFund, setCurrentFund] = useState<PatrimonialFundDto | null>(null);
    const [codeFilter, setCodeFilter] = useState<string>("");

    // gestione inizializzazione fund
    // - stato per apertura dialog    => openInitFundDialog
    const [openInitFundDialog, setOpenInitFundDialog] = useState(false);
    // - stato per movimento corrente => currentFundInitMovement
    const [currentFundInitMovement, setCurrentFundInitMovement] = useState<MovementDto | null>(null);

    const service = PatrimonialFundService.getInstance();

    const movementService = MovementService.getInstance();


    useEffect(() => {
        loadFunds(codeFilter);
    }, []);

    const loadFunds = async (
        codeValue:string|undefined
    ) => {
        await service.loadFundWithInit(codeValue, setFunds);
    };

    const resetFilters = () => {
        setCodeFilter("");
        loadFunds("");
    };

    const saveFund = async (
        fund: PatrimonialFundDto) => {
        if( fund.id ) {
            await service.edit(fund);
        } else {
            await service.insert(fund);
        }
        setOpen(false);
        await loadFunds(codeFilter);
    };

    const deleteFund = async (id: number) => {
        // API call to delete the category
        await service.delete(id);
        await loadFunds(codeFilter);
    };

    // inizializzazione fondo
    const convertToFundDto = (fund: PatrimonialFundInitDto): PatrimonialFundDto => {
        const fundDto = new PatrimonialFundDto();
        fundDto.id = fund.id;
        fundDto.code = fund.code;
        fundDto.label = fund.label;
        return fundDto;
    }

    const handleChangeInFundInitMovement = async (
        field: keyof MovementDto, value: any) => {
        setCurrentFundInitMovement({...currentFundInitMovement, [field]: value});
    };

    const saveInitMovement = async (e: React.FormEvent) => {
        e.preventDefault();
        if( !currentFundInitMovement ) { alert("Nessuna inizializzazione fondo selezionata.") }
        if(currentFundInitMovement.id) {
            // Aggiorna il movimento esistente
            await movementService.edit(currentFundInitMovement);
        } else {
            // Crea un nuovo movimento
            await movementService.insert(currentFundInitMovement);
        }
        setOpenInitFundDialog(false);
        await loadFunds(codeFilter);
    }

    const buildInitMovement = (fund: PatrimonialFundInitDto): MovementDto => {
        let mvn = new MovementDto();
        mvn.patrimonialFund = convertToFundDto(fund);
        mvn.dt = DateUtils.currentDate();
        mvn.blockId = DateUtils.createBlockId();
        mvn.note = Constants.INIT_NOTE
        mvn.amount=0;
        return mvn;
    }

    const handleDeleteInitMovement = async (mov : MovementDto) => {

        // ask to the user to confirm the deletion
        if (!mov || !mov.id) {
            alert("Nessuna inizializzazione fondo selezionata.");
            return;
        }
        if (!confirm("Sei sicuro di voler eliminare l'inizializzazione del fondo?")) {
            return;
        }
        // delete the currentFundInitMovement
        await movementService.delete(mov.id);
        // reload the funds
        setOpenInitFundDialog(false);
        setCurrentFundInitMovement(null);
        await loadFunds(codeFilter);
    }


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

            {/* Sezione filtri */}
            <div className="bg-muted/40 p-4 rounded-md mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4" />
                    <h3 className="font-medium">Filtri</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm mb-1 block">Codice</label>
                        <Input
                            value={codeFilter}
                            onChange={(e) => setCodeFilter(e.target.value)}
                            placeholder="Filtra per codice"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <Button onClick={()=>loadFunds(codeFilter)} className="flex-1">
                            Applica filtri
                        </Button>
                        <Button variant="outline" onClick={resetFilters}>
                            Resetta
                        </Button>
                    </div>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Natura</TableHead>
                        <TableHead>Codice</TableHead>
                        <TableHead>Etichetta</TableHead>
                        <TableHead className="text-center">Valore iniziale</TableHead>
                        <TableHead className="text-center">Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {funds.map(fund => (
                        <TableRow key={fund.id}>
                            <TableCell>
                                <BulletNature nature={CategoryNature.F} blinking={false} content={"F"} />
                            </TableCell>
                            <TableCell>{fund.code}</TableCell>
                            <TableCell>{fund.label}</TableCell>
                            <TableCell>
                                <div className="flex justify-end align-middle gap-2">
                                {
                                    fund.initialMovement ?
                                        (
                                            <>
                                            <span className={'flex items-center gap-2'}>
                                                {CurrencyEur.getInstance().format(fund.initialMovement?.amount ?? 0)}
                                            </span>
                                            <Button variant="secondary" size="sm" onClick={() => {
                                                setCurrentFundInitMovement(fund.initialMovement);
                                                setOpenInitFundDialog(true);
                                            }}>
                                                <Edit></Edit>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={()=>{handleDeleteInitMovement(fund.initialMovement)}}>
                                                <Trash></Trash>
                                            </Button>
                                            </>
                                        ):
                                        (
                                            <Button variant="default" size="sm" onClick={() => {
                                                setCurrentFundInitMovement(buildInitMovement(fund));
                                                setOpenInitFundDialog(true);
                                            }}>
                                                Inizializza fondo
                                            </Button>
                                        )
                                }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setCurrentFund(convertToFundDto(fund));
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

            {/* Dialog per la modifica e l'inserimento dei fondi */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className=" bg-secondary">
                    <DialogHeader>
                        <DialogTitle>{currentFund?.id ? "Modifica" : "Nuovo"} Fondo Patrimoniale</DialogTitle>
                    </DialogHeader>
                    {currentFund && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Codice</label>
                                <Input
                                    value={currentFund.code || ''}
                                    onChange={e => setCurrentFund({...currentFund, code: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Etichetta</label>
                                <Input
                                    value={currentFund.label || ''}
                                    onChange={e => setCurrentFund({...currentFund, label: e.target.value})}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => saveFund(currentFund)}>
                                    Salva
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/*
                Dialog per la modifica e l'inserimento dell'inizializzazione di un fondo
                const [openInitFundDialog, setOpenInitFundDialog] = useState(false);
                const [currentFundInitMovement, setCurrentFundInitMovement] = useState<MovementDto | null>(null);
            */}
            <Dialog open={openInitFundDialog} onOpenChange={setOpenInitFundDialog}>
                <DialogContent className=" bg-secondary">
                    <DialogHeader>
                        <DialogTitle>{currentFundInitMovement?.id ? "Modifica" : "Nuova"} Inizializzazione Fondo Patrimoniale</DialogTitle>
                    </DialogHeader>

                    <span>Fondo: <b>{ currentFundInitMovement?.patrimonialFund?.label }</b></span>

                    <form onSubmit={saveInitMovement} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Data</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={currentFundInitMovement?.dt ? DateUtils.formatDate(currentFundInitMovement.dt) : ''}
                                    onChange={(e) => handleChangeInFundInitMovement(
                                        'dt',
                                        new Date(e.target.value))
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Importo</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={currentFundInitMovement?.amount || ''}
                                    onChange={(e) => handleChangeInFundInitMovement('amount', parseFloat(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={()=>{
                                setOpenInitFundDialog(false);
                                setCurrentFundInitMovement(null);
                            }}>
                                Annulla
                            </Button>
                            <Button type="submit">Salva</Button>
                        </DialogFooter>

                    </form>

                </DialogContent>
            </Dialog>

        </Card>
    );

}