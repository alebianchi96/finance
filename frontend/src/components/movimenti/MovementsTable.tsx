// src/components/movimenti/MovementsTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import MovementDto from "@/dto/finance/MovementDto";

interface MovementsTableProps {
    movements: MovementDto[];
    onEdit: (movement: MovementDto) => void;
    onDelete: (id: number) => void;
}

export default function MovementsTable({ movements, onEdit, onDelete }: MovementsTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Account Economico</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right">Importo</TableHead>
                        <TableHead>Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {movements.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                Nessun movimento trovato per questo fondo
                            </TableCell>
                        </TableRow>
                    ) : (
                        movements.map((movement) => (
                            <TableRow key={movement.id}>
                                <TableCell>{format(new Date(movement.dt), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{movement.economicAccount?.name || 'N/D'}</TableCell>
                                <TableCell>{movement.note}</TableCell>
                                <TableCell className={`text-right ${movement.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {formatCurrency(movement.amount)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => onEdit(movement)}>
                                            Modifica
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => onDelete(movement.id)}>
                                            Elimina
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}