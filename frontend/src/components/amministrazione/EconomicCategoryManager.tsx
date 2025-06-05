// src/components/amministrazione/EconomicCategoryManager.tsx
import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto";
import EconomicCategoryService from "@/service/EconomicCategoryService.ts";
import SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import { Filter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function EconomicCategoryManager() {
    const [categories, setCategories] = useState<EconomicCategoryDto[]>([]);
    const [open, setOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<EconomicCategoryDto | null>(null);

    const [natureFilter, setNatureFilter] = useState<string>("");
    const [codeFilter, setCodeFilter] = useState<string>("");

    const service = EconomicCategoryService.getInstance();

    useEffect(() => {
        loadCategories();
    }, [])

    // Queste funzioni sarebbero implementate con chiamate API al backend
    const loadCategories = async () => {
        // API call to load categories
        const searchRequest = new SearchRequestDto<EconomicCategoryDto>();
        searchRequest.dto = new EconomicCategoryDto();
        searchRequest.size = 999999
        searchRequest.page = 1;
        if (natureFilter && natureFilter !== "any") {
            searchRequest.dto.nature = natureFilter;
        }
        if (codeFilter) {
            searchRequest.dto.code = codeFilter;
        }

        let response = await service.search(searchRequest);
        let lst = response?.dto?.list || [];
        if(lst) {
            lst.sort((a, b) => {

                if( a.nature==b.nature ) {
                    return a.code < b.code ? -1 : 1;
                }
                return a.nature < b.nature ? -1 : 1;

            });
        }
        setCategories( lst );
    };

    const resetFilters = () => {
        setNatureFilter("");
        setCodeFilter("");
        loadCategories();
    };

    const saveCategory = async (category: EconomicCategoryDto) => {
        // API call to save the category

        if( !category.nature ) {
            category.nature = 'C'; // Default to COSTO if not set
        }

        if( category.id ) {
            await service.edit(category);
        } else {
            await service.insert(category);
        }

        setOpen(false);
        await loadCategories();
    };

    const deleteCategory = async (id: number) => {
        // API call to delete the category
        await service.delete(id);
        await loadCategories();
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Categorie Economiche</h2>
                <Button onClick={() => {
                    setCurrentCategory(new EconomicCategoryDto());
                    setOpen(true);
                }}>
                    Nuova Categoria
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
                        <Select value={natureFilter} onValueChange={setNatureFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Qualsiasi natura" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Qualsiasi</SelectItem>
                                <SelectItem value="C" className="text-white font-medium bg-red-600">COSTO</SelectItem>
                                <SelectItem value="R" className="text-white font-medium bg-green-600">RICAVO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Codice</label>
                        <Input
                            value={codeFilter}
                            onChange={(e) => setCodeFilter(e.target.value)}
                            placeholder="Filtra per codice"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <Button onClick={loadCategories} className="flex-1">
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
                        <TableHead>Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories?.map(category => (
                        <TableRow key={category.id}>
                            {/* <TableCell>{category.id}</TableCell> */}
                            <TableCell className={`text-white font-medium ${category.nature === 'C' ? "bg-red-600" : "bg-green-600"}`}>
                                {category.nature === 'C' ? 'COSTO' : 'RICAVO'}
                            </TableCell>
                            <TableCell>{category.code}</TableCell>
                            <TableCell>{category.label}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setCurrentCategory(category);
                                        setOpen(true);
                                    }}>
                                        Modifica
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteCategory(category.id)}>
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
                        <DialogTitle>{currentCategory?.id ? "Modifica" : "Nuova"} Categoria Economica</DialogTitle>
                    </DialogHeader>
                    {currentCategory && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Nome</label>
                                <Input
                                    value={currentCategory.code || ''}
                                    onChange={e => setCurrentCategory({...currentCategory, code: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Descrizione</label>
                                <Input
                                    value={currentCategory.label || ''}
                                    onChange={e => setCurrentCategory({...currentCategory, label: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Natura</label>
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${currentCategory.nature === 'R' ? 'bg-green-600':'bg-red-600' }`}></div>
                                        <span className="font-medium">
                                            {currentCategory.nature === 'R' ? 'RICAVO':'COSTO' }
                                        </span>
                                    </div>
                                    <Switch
                                        checked={currentCategory.nature === 'R'}
                                        onCheckedChange={(checked) =>
                                            setCurrentCategory({...currentCategory, nature: checked ? 'R' : 'C'})
                                        }
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Sposta l'interruttore a destra per RICAVO, a sinistra per COSTO
                                </p>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => saveCategory(currentCategory)}>
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