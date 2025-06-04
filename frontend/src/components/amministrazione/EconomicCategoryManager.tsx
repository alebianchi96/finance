// src/components/amministrazione/EconomicCategoryManager.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto";

export default function EconomicCategoryManager() {
    const [categories, setCategories] = useState<EconomicCategoryDto[]>([]);
    const [open, setOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<EconomicCategoryDto | null>(null);

    // Queste funzioni sarebbero implementate con chiamate API al backend
    const loadCategories = () => {
        // API call to load categories
        // setCategories(result);
    };

    const saveCategory = (category: EconomicCategoryDto) => {
        // API call to save the category
        setOpen(false);
        loadCategories();
    };

    const deleteCategory = (id: number) => {
        // API call to delete the category
        loadCategories();
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

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrizione</TableHead>
                        <TableHead>Natura</TableHead>
                        <TableHead>Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map(category => (
                        <TableRow key={category.id}>
                            <TableCell>{category.id}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.description}</TableCell>
                            <TableCell>{category.nature}</TableCell>
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
                                    value={currentCategory.name || ''}
                                    onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Descrizione</label>
                                <Input
                                    value={currentCategory.description || ''}
                                    onChange={e => setCurrentCategory({...currentCategory, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Natura</label>
                                <Input
                                    value={currentCategory.nature || ''}
                                    onChange={e => setCurrentCategory({...currentCategory, nature: e.target.value})}
                                />
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