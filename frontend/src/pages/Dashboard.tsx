// src/pages/Dashboard.tsx
import React, {useState} from "react";
import ReportService from "@/service/ReportService.ts";
import DateUtils from "@/lib/DateUtils.ts";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {ArcElement, Chart as ChartJS, Legend, Tooltip as ChartTooltip} from 'chart.js';
import type VEconomicResultDetailDto from "@/dto/finance/report/view/VEconomicResultDetailDto.ts";
import EconomicResultYear from "@/components/dashboard/EconomicResultYear.tsx";
import PfMenuIcon from "@/components/layout/PfMenuIcon.tsx";
import {navItems} from "@/components/layout/NavBarItemList.tsx";
import type PatrimonialReport from "@/dto/finance/report/model/PatrimonialReport.ts";
import PatrimonialStatusYear from "@/components/dashboard/PatrimonialStatusYear.tsx";
import type VEconomicResultDto from "@/dto/finance/report/view/VEconomicResultDto.ts";
import BilanceYear from "@/components/dashboard/BilanceYear.tsx";


ChartJS.register(ArcElement, ChartTooltip, Legend);

export default function Dashboard() {

    const reportService = ReportService.getInstance();

    // -----------------------------------------------------------
    // APERTURA DELLA PAGINA
    // -----------------------------------------------------------
    // lista degli anni aventi transazioni
    const [ listYearsWithTransactions, setListYearsWithTransactions ] = useState<number[]>([]);
    const [ selectedYear, setSelectedYear ] = useState<string>( DateUtils.currentYearAsString() );
    React.useEffect(()=>{
        reportService.listYearsWithTransactions().then((lstYears)=>{ setListYearsWithTransactions(lstYears) });
    }, [])

    // -----------------------------------------------------------
    // CAMBIO DELL'ANNO SELEZIONATO
    // -----------------------------------------------------------
    // recupero dei dati patrimoniali
    const getPatrimonial = async () => {

        if( !selectedYear ) { return; }

        let selectedYearInt = Number.parseInt(selectedYear);

        // DATA INIZIO ANNO
        const startYearDate = DateUtils.startOfYearDate( selectedYearInt );

        // DATA CORRENTE / FINE ANNO
        let endYearDate = DateUtils.currentDate();
        if( selectedYear!==DateUtils.currentYearAsString() ) {
            // se l'anno e' finito, la data di fine ciclo
            // dovra' essere il 1/1 anno successivo al selezionato
            endYearDate = DateUtils.startOfYearDate( (selectedYearInt+1) );
        }

        let patrimonialStartYear = await reportService
            .getPatrimonialResult(startYearDate);
        let patrimonialEndYear = await reportService
            .getPatrimonialResult(endYearDate);
        let yearResult = 0 + patrimonialEndYear?.dto.totalAmount - patrimonialStartYear?.dto.totalAmount;

        return {
            patrimonialStartYear: patrimonialStartYear?.dto,
            patrimonialEndYear: patrimonialEndYear?.dto,
            yearResult: yearResult
        }

    };
    const [ patrimonial, setPatrimonial ] = useState<PatrimonialReport>();

    const [ vEconomicDetailResult, setVEconomicDetailResult ] = useState<VEconomicResultDetailDto[] | undefined>();
    const [ vEconomicResult, setVEconomicResult ] = useState<VEconomicResultDto[] | undefined>();
    const [ avgEconomicResult, setAvgEconomicResult ] = useState<number | undefined>(0);

    React.useEffect(()=>{

        getPatrimonial().then(p=>{
            setPatrimonial(p)
        })

        reportService.getVEconomicDetailResult( selectedYear ).then( res => {
            res && setVEconomicDetailResult(res)
            // console.log(res);
        });

        reportService.getVEconomicResult( selectedYear ).then( res => {

            if(!res) {return;}
            setVEconomicResult(res);
            let numberOfMonthsWithMovements = 0;
            let totalYearResult = 0;
            for( let item of res ) {
                let formattedAsNumber = Number.parseInt(item.monthIndex)
                if( !formattedAsNumber || isNaN(formattedAsNumber) ) {
                    totalYearResult = item.totale;
                    continue;
                }
                if( item.totaleCosti || item.totaleRicavi ) {
                    numberOfMonthsWithMovements++;
                }
            }
            let avg = numberOfMonthsWithMovements>0 ? (totalYearResult / numberOfMonthsWithMovements) : 0;
            setAvgEconomicResult( avg );

        });

    }, [selectedYear])

    return (
        <div className="space-y-4 w-full text-foreground">
            {/* <DashboardHeader /> */}

            {/* Titolo della pagina */}
            <div className="flex items-center justify-between">
                <div className="text-xl font-bold flex items-center gap-2 text-primary">
                    <PfMenuIcon item={navItems.filter(item=>item.label.toLowerCase()==='dashboard')[0]} />
                    <div>Dashboard</div>
                </div>
                {/* combo con anni */}
                <div className="w-1/4 flex items-center gap-2">
                    <Label htmlFor="_year">Anno:</Label>
                    <Select required
                            value={selectedYear}
                            onValueChange={(val)=>{ setSelectedYear(val) }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleziona un anno di riferimento:" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                listYearsWithTransactions.map(year => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* patrimonio + situazione economica */}
            <div className="w-full lg:flex gap-4">
                <PatrimonialStatusYear selectedYear={selectedYear} patrimonial={patrimonial} />
                <EconomicResultYear
                    selectedYear={selectedYear}
                    vEconomicResult={vEconomicResult}
                    avgEconomicResult={avgEconomicResult}/>
            </div>

            {/* Bilancio */}
            <BilanceYear
                selectedYear={selectedYear}
                vEconomicDetailResult={vEconomicDetailResult}
                vEconomicResult={vEconomicResult}
                setVEconomicDetailResult={setVEconomicDetailResult}/>

        </div>
    );


}