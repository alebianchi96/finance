// src/components/movimenti/MovementForm.tsx
import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import MovementDto from "@/dto/finance/MovementDto";
import EconomicAccountDto from "@/dto/finance/EconomicAccountDto";
import type EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto.ts";
import EconomicCategoryService from "@/service/EconomicCategoryService.ts";
import EconomicAccountService from "@/service/EconomicAccountService.ts";
import BulletAndLabelNature from "@/components/common/bullet/BulletAndLabelNature.tsx";
import DateUtils from "@/lib/DateUtils.ts";
import CategoryNature from "@/components/common/bullet/CategoryNature.ts";

interface MovementFormProps {
    movement: MovementDto;
    onSave: (movement: MovementDto) => void;
    onCancel: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    nature?: "C" | "R";
}

export default function MovementForm({ movement, onSave, onCancel, isOpen, setIsOpen, nature }: MovementFormProps) {

    const [formData, setFormData] = useState<MovementDto>({...movement});

    const [economicCategories, setEconomicCategories] = useState<EconomicCategoryDto[]>([]);
    const [economicAccounts, setEconomicAccounts] = useState<EconomicAccountDto[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<EconomicCategoryDto | null>(null);

    const economicCategoryService = EconomicCategoryService.getInstance();
    const economicAccountService = EconomicAccountService.getInstance();

    // Caricamento delle categorie economiche
    useEffect(() => {
        economicCategoryService.load(nature, undefined, setEconomicCategories)
        // occorre caricare gli accounts usando la categoria del formData
        if(formData && formData.economicAccount && formData.economicAccount.economicCategory) {
            economicAccountService.load(
                nature,
                formData.economicAccount.economicCategory.code, undefined, setEconomicAccounts)
        }
    }, []);

    // Caricamento degli account economici
    useEffect(() => {
        selectedCategory && economicAccountService.load(nature, selectedCategory.code, undefined, setEconomicAccounts)
    }, [selectedCategory]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field: keyof MovementDto, value: any) => {
        setFormData({...formData, [field]: value});
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px] bg-secondary">
                <DialogHeader>
                    <DialogTitle className="flex justify-around">
                        <div className="flex ">
                           <span>{movement.id ? "Modifica Movimento" : "Nuovo Movimento"}</span>
                        </div>
                        <BulletAndLabelNature nature={CategoryNature.get(nature)} />
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.dt ? DateUtils.formatDate(formData.dt) : ''}
                                onChange={(e) => handleChange(
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
                                value={
                                    formData.amount >= 0 || formData.amount <= 0 ?
                                        formData.amount : ''
                                }
                                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="account">Categoria:</Label>
                        <Select
                            value={formData.economicAccount?.economicCategory?.id.toString()}
                            onValueChange={(value) => {
                                const category = economicCategories.find(a => a.id === parseInt(value));
                                if (category) {
                                    setSelectedCategory(category);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona una categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {economicCategories.map(category => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="account">Conto economico:</Label>
                        <Select
                            required
                            value={formData.economicAccount?.id?.toString()}
                            onValueChange={(value) => {
                                const account = economicAccounts.find(a => a.id === parseInt(value));
                                if (account) {
                                    handleChange('economicAccount', account);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleziona un account economico" />
                            </SelectTrigger>
                            <SelectContent>
                                {economicAccounts.map(account => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                        {account.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Note</Label>
                        <Input
                            id="note"
                            value={formData.note || ''}
                            onChange={(e) => handleChange('note', e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Annulla
                        </Button>
                        <Button type="submit">Salva</Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    );
}