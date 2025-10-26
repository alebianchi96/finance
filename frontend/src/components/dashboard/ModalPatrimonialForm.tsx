import React, {useEffect} from "react";
import ReportService from "@/service/ReportService.ts";
import type PatrimonialResultDto from "@/dto/finance/report/PatrimonialResultDto.ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import type PatrimonialResultItem from "@/dto/finance/report/PatrimonialResultItem.ts";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import DateUtils from "@/lib/DateUtils.ts";

export default function ModalPatrimonialForm(
    { selectedYear, onCancel, patrimonial, isOpen, setIsOpen }
    : {
        selectedYear:string,
        onCancel: () => void,
        patrimonial: PatrimonialResultDto | undefined,
        isOpen: boolean,
        setIsOpen: (open: boolean) => void
    }
) {

    const reportService = ReportService.getInstance();

    useEffect(() => {
        // selectedYear && isOpen && console.log( patrimonial )
    }, [selectedYear]);

    function sort(list : PatrimonialResultItem[] | undefined): PatrimonialResultItem[] {
        if(!list) return [];
        return list.sort((a, b) => {
            if (a.amount > b.amount) return -1;
            if (a.amount < b.amount) return 1;
            return 0;
        });
    }

    function calculatePercentage( part:number = 0, total:number = 0 ) : string {
        if( total==0 || part==0) return "0 %";
        let perc = (part / total) * 100;
        return perc.toFixed(2) + " %";
    }

    function getRefDay() {
        let currentYear:string = DateUtils.currentYearAsString();
        if( currentYear==selectedYear ) {
            return DateUtils.formatDateByTemplate( DateUtils.currentDate(), "DD/MM/YYYY" );
        } else {
            let refDate = new Date( Number.parseInt(selectedYear), 11, 31, 23, 59, 59 );
            return DateUtils.formatDateByTemplate( refDate, "DD/MM/YYYY" );
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px] bg-secondary">
                <DialogHeader>
                    <DialogTitle className="flex justify-start text-primary">
                        <div className="flex ">
                            <span>💰 Dettaglio patrimonio anno: {selectedYear}</span>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="py-4">
                    <div className="py-2 italic">Giorno di riferimento: { getRefDay() }</div>
                    {sort(patrimonial?.listItems).map((item) => (
                        !item.amount || item.amount==0 ? <></> :
                        <div className="grid grid-cols-4 py-2 hover:font-bold hover:px-2 hover:shadow-sm shadow-gray-600 rounded-4xl" key={item.patrimonialFund.code}>
                            <div className="col-span-2 flex items-center">{item.patrimonialFund.label}</div>
                            <div className="flex items-center justify-end">{CurrencyEur.format(item.amount)}</div>
                            <div className="flex items-center justify-end">{calculatePercentage(item.amount, patrimonial?.totalAmount)}</div>
                        </div>
                    ))}
                    <div className="grid grid-cols-4 py-2 mt-4 rounded-4xl font-bold text-primary" key={'Totale'}>
                        <div className="col-span-2 flex items-center">TOTALE</div>
                        <div className="flex items-center justify-end">{CurrencyEur.format(patrimonial?.totalAmount)}</div>
                        <div className="flex items-center justify-end">{calculatePercentage(patrimonial?.totalAmount, patrimonial?.totalAmount)}</div>
                    </div>
                </DialogDescription>
                {/*
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Chiudi
                    </Button>
                </DialogFooter>
                */}
            </DialogContent>
        </Dialog>
    );
}