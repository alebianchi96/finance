// src/components/amministrazione/EconomicAccountManager.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EconomicAccountDto from "@/dto/finance/EconomicAccountDto";
import EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto";
import EconomicCategoryService from "@/service/EconomicCategoryService.ts";
import EconomicAccountService from "@/service/EconomicAccountService.ts";
import SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";
import {Filter} from "lucide-react";
import BulletAndLabelNature from "@/components/common/BulletAndLabelNature.tsx";

export default function EconomicAccountManager() {

    const [accounts, setAccounts] = useState<EconomicAccountDto[]>([]);
    const [categories, setCategories] = useState<EconomicCategoryDto[]>([]);
    const [open, setOpen] = useState(false);
    const [currentAccount, setCurrentAccount] = useState<EconomicAccountDto | null>(null);

    const [natureFilter, setNatureFilter] = useState<string>("");
    const [codeCategoryFilter, setCodeCategoryFilter] = useState<string>("");
    const [codeAccountFilter, setCodeAccountFilter] = useState<string>("");

    const categoryService = EconomicCategoryService.getInstance();
    const accountService = EconomicAccountService.getInstance();

    useEffect(() => {
        loadAll(natureFilter, codeCategoryFilter, codeAccountFilter);
    }, []);

    const loadAll = async (natureFilter, codeCategoryFilter, codeAccountFilter) => {
        await loadAccounts(natureFilter, codeCategoryFilter, codeAccountFilter);
        await loadCategories(natureFilter, codeCategoryFilter);
    }

    const handleChangeNatureFilter = (e: string) => {
        setNatureFilter(e);
        loadAll(e, codeCategoryFilter, codeAccountFilter);
    }

    const loadAccounts = async (
        natureValue:string|undefined,
        codeCategoryValue:string|undefined,
        codeAccountValue:string|undefined
    ) => {
        await accountService.load(natureValue, codeCategoryValue, codeAccountValue, setAccounts);
    };

    const loadCategories = async (
        natureValue:string|undefined,
        codeValue:string|undefined
    ) => {
        await categoryService.load(natureValue, codeValue, setCategories);
    };


    const resetFilters = () => {
        setNatureFilter("");
        setCodeCategoryFilter("");
        setCodeAccountFilter("");
        loadAll("", "", "");
    };


    const saveAccount = async (account: EconomicAccountDto) => {
        if( account.id ) {
            await accountService.edit(account);
        } else {
            await accountService.insert(account);
        }

        setOpen(false);
        loadAll(natureFilter, codeCategoryFilter, codeAccountFilter);
    };

    const deleteAccount = async (id: number) => {
        await accountService.delete(id);
        loadAll(natureFilter, codeCategoryFilter, codeAccountFilter);
    };

    const buildTableRows = (accounts: EconomicAccountDto[]) => {
        let arrayRows = [];

        let currentIdCategory = null;

        for(let account of accounts) {

            if(!currentIdCategory || currentIdCategory !== account.economicCategory.id) {
                currentIdCategory = account.economicCategory.id;
                arrayRows.push(
                    <TableRow key={account.economicCategory.id + "-header"} className={'bg-secondary'}>
                        <TableCell className={'flex items-center gap-2'}>
                            <div style={{
                                borderRadius:'50px',
                                width:'30px',
                                height:'30px'
                            }}
                                 className={
                                     `text-white font-medium flex items-center justify-center `
                                     + (account.economicCategory.nature === 'C' ? "bg-red-600" : "bg-green-600")
                                 }>
                                {account.economicCategory.nature}
                            </div>
                            <div>
                                {account.economicCategory.code}
                            </div>
                        </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                    </TableRow>
                );
            }

            let r = (
                <TableRow key={account.id}>
                    <TableCell> </TableCell>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.label}</TableCell>
                    <TableCell>
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => {
                                setCurrentAccount(account);
                                setOpen(true);
                            }}>
                                Modifica
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteAccount(account.id)}>
                                Elimina
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>);
            arrayRows.push(r);
        }
        return arrayRows;

    }

    return (
        <Card className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Conti Economici</h2>
                <Button onClick={() => {
                    setCurrentAccount(new EconomicAccountDto());
                    setOpen(true);
                }}>
                    Nuovo Account
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
                        <label className="text-sm mb-1 block">Natura</label>
                        <Select value={natureFilter} onValueChange={(e)=>handleChangeNatureFilter(e)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Qualsiasi natura" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Qualsiasi</SelectItem>
                                <SelectItem value="C" key="C">
                                    <BulletAndLabelNature nature="C" />
                                </SelectItem>
                                <SelectItem value="R" key="R">
                                    <BulletAndLabelNature nature="R" />
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Codice Categoria</label>
                        <Input
                            value={codeCategoryFilter}
                            onChange={(e) => setCodeCategoryFilter(e.target.value)}
                            placeholder="Filtra per codice categoria"
                        />
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Codice Conto</label>
                        <Input
                            value={codeAccountFilter}
                            onChange={(e) => setCodeAccountFilter(e.target.value)}
                            placeholder="Filtra per codice conto"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <Button onClick={()=>loadAll(natureFilter, codeCategoryFilter, codeAccountFilter)} className="flex-1">
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
                        <TableHead>Categoria</TableHead>
                        <TableHead>Codice</TableHead>
                        <TableHead>Etichetta</TableHead>
                        <TableHead className="text-center">Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {buildTableRows(accounts)}
                </TableBody>
            </Table>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentAccount?.id ? "Modifica" : "Nuovo"} Account Economico</DialogTitle>
                    </DialogHeader>
                    {currentAccount && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Nome</label>
                                <Input
                                    value={currentAccount.code || ''}
                                    onChange={e => setCurrentAccount({...currentAccount, code: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Descrizione</label>
                                <Input
                                    value={currentAccount.label || ''}
                                    onChange={e => setCurrentAccount({...currentAccount, label: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Categoria Economica</label>
                                <Select
                                    value={currentAccount.economicCategory?.id?.toString()}
                                    onValueChange={(value) => {
                                        const category = categories.find(c => c.id === parseInt(value));
                                        setCurrentAccount({...currentAccount, economicCategory: category || null});
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona una categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id.toString()} className={"flex items-center gap-2"}>
                                                <div className={`w-4 h-4 rounded-full ${category.nature === 'R' ? 'bg-green-600':'bg-red-600' }`}></div>
                                                    <span className="font-medium">
                                                    {category.code}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => saveAccount(currentAccount)}>
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