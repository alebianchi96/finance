// src/components/amministrazione/PatrimonialFundManager.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";
import SearchRequestDto from "@/dto/framework/SearchRequestDto";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";
import EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto.ts";
import EconomicCategoryService from "@/service/EconomicCategoryService.ts";
import PatrimonialFundService from "@/service/PatrimonialFundService.ts";
import {Filter} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

export default function PatrimonialFundManager() {

    const [funds, setFunds] = useState<PatrimonialFundDto[]>([]);
    const [open, setOpen] = useState(false);
    const [currentFund, setCurrentFund] = useState<PatrimonialFundDto | null>(null);
    const [codeFilter, setCodeFilter] = useState<string>("");

    const service = PatrimonialFundService.getInstance();

    useEffect(() => {
        loadFunds(codeFilter);
    }, []);

    const loadFunds = async (
        codeValue:string|undefined
    ) => {

        // API call to load categories
        const searchRequest = new SearchRequestDto<PatrimonialFundDto>();
        searchRequest.dto = new PatrimonialFundDto();
        searchRequest.size = 999999
        searchRequest.page = 1;
        if (codeValue) {
            searchRequest.dto.code = codeValue;
        }

        let response : PfObjectApiResponse<SearchResponseDto<PatrimonialFundDto>> = await service.search(searchRequest);
        let lst = response?.dto?.list || [];
        if(lst) {
            lst.sort((a, b) => {
                return a.code < b.code ? -1 : 1;
            });
        }
        setFunds( lst );

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
                        <TableHead>Codice</TableHead>
                        <TableHead>Etichetta</TableHead>
                        <TableHead>Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {funds.map(fund => (
                        <TableRow key={fund.id}>
                            <TableCell className={'flex items-center gap-2'}>
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
                                    {fund.code}
                                </div>
                            </TableCell>
                            <TableCell>{fund.label}</TableCell>
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
        </Card>
    );
}