// src/components/trasferimenti/TransferTable.tsx
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import type TransferMovementDto from "@/dto/finance/TransferMovementDto.ts";
import DateUtils from "@/lib/DateUtils.ts";

interface TransferTableProps {
    transfers: TransferMovementDto[];
    onEdit: (transfer: TransferMovementDto) => void;
    onDelete: (transfer: TransferMovementDto) => void;
}

export default function TransferTable({ transfers, onEdit, onDelete }: TransferTableProps) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Da</TableHead>
                    <TableHead>A</TableHead>
                    <TableHead className="text-right">Importo</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-center">Azioni</TableHead>
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
                            <TableCell className={ DateUtils.isFuture( transfer.dt ) }>
                                {DateUtils.formatDateByTemplate( transfer.dt, 'DD/MM/YYYY')}
                                { DateUtils.isFuture( transfer.dt ) ? ' Futura?' : '' }
                            </TableCell>
                            <TableCell>{transfer.patrimonialFundFrom?.label}</TableCell>
                            <TableCell>{transfer.patrimonialFundTo?.label}</TableCell>
                            <TableCell className="text-right">{
                                CurrencyEur.getInstance().format(Math.abs(transfer.amount))
                            }</TableCell>
                            <TableCell>{transfer.note}</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2">
                                    {
                                        transfer.patrimonialFundFrom ?
                                            (
                                            <>
                                            <Button variant="outline" size="sm" onClick={() => onEdit(transfer)}>
                                                Modifica
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => onDelete(transfer)}>
                                                Elimina
                                            </Button>
                                            </>
                                            ) : (<></>)
                                    }

                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}