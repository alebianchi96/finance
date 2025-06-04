// src/components/trasferimenti/TransferTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import MovementDto from "@/dto/finance/MovementDto";

interface TransferTableProps {
    transfers: MovementDto[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TransferTable({ transfers, onEdit, onDelete }: TransferTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Da Fondo</TableHead>
                    <TableHead>A Fondo</TableHead>
                    <TableHead className="text-right">Importo</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Azioni</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transfers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nessun trasferimento trovato
                        </TableCell>
                    </TableRow>
                ) : (
                    transfers.map(transfer => (
                        <TableRow key={transfer.id}>
                            <TableCell>{format(new Date(transfer.dt), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{transfer.fromPatrimonialFund?.name}</TableCell>
                            <TableCell>{transfer.patrimonialFund?.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(Math.abs(transfer.amount))}</TableCell>
                            <TableCell>{transfer.note}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => onEdit(transfer.id)}>
                                        Modifica
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(transfer.id)}>
                                        Elimina
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}