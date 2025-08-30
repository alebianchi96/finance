// src/components/movimenti/MovementsTable.tsx
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import MovementDto from "@/dto/finance/MovementDto";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import DateUtils from "@/lib/DateUtils.ts";

interface MovementsTableProps {
    movements: MovementDto[];
    onEdit: (movement: MovementDto) => void;
    onDelete: (id: number) => void;
}

export default function MovementsTable({ movements, onEdit, onDelete }: MovementsTableProps) {

    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Account Economico</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right">Importo</TableHead>
                        <TableHead className="text-center">Azioni</TableHead>
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
                                <TableCell className={ DateUtils.isFuture( movement.dt ) }>
                                    {DateUtils.formatDateByTemplate( movement.dt, 'DD/MM/YYYY' )}
                                    { DateUtils.isFuture( movement.dt ) ? ' Futura?' : '' }
                                </TableCell>
                                <TableCell>
                                    {movement.economicAccount?.economicCategory?.label + " - " + movement.economicAccount?.label}
                                </TableCell>
                                <TableCell>{movement.note}</TableCell>
                                <TableCell className={`text-right ${movement.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {CurrencyEur.getInstance().format(movement.amount)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center space-x-2">
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