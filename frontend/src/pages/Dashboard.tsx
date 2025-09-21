// src/pages/Dashboard.tsx
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import ReportService from "@/service/ReportService.ts";
import EconomicAccountDto from "@/dto/finance/report/EconomicResultDto.ts";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import type PatrimonialResultDto from "@/dto/finance/report/PatrimonialResultDto.ts";
import DateUtils from "@/lib/DateUtils.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import BulletNature from "@/components/common/bullet/BulletNature.tsx";
import CategoryNature from "@/components/common/bullet/CategoryNature.ts";

export default function Dashboard() {

/*

-> Rilascio

-> Rilascio con db di prod

-> Popolamento dati

*/

    const navigate = useNavigate();

    const reportService = ReportService.getInstance();

    // Results state
    const [currentMonthEconomicResult, setCurrentMonthEconomicResult] = useState<EconomicAccountDto | null>(null);
    const [currentYearEconomicResult, setCurrentYearEconomicResult] = useState<EconomicAccountDto | null>(null);
    const [currentPatrimonialResult, setCurrentPatrimonialResult] = useState<PatrimonialResultDto | null>(null);
    const [yearStartPatrimonialResult, setYearStartPatrimonialResult] = useState<PatrimonialResultDto | null>(null);
    // -------------
    const [economicResult, setEconomicResult] = useState<EconomicAccountDto | null>(null);
    const [patrimonialResult, setPatrimonialResult] = useState<PatrimonialResultDto | null>(null);

    const retrieveCurrentMonthEconomicResult = async () => {
        const { from, to } = DateUtils.currentMonthRange();
        const response = await reportService.getEconomicResult(from, to);
        setCurrentMonthEconomicResult(response?.dto);
    }

    const retrieveCurrentYearEconomicResult = async () => {
        const { from, to } = DateUtils.currentYearRange();
        const response = await reportService.getEconomicResult(from, to);
        setCurrentYearEconomicResult(response?.dto);
    }

    const retrieveCurrentPatrimonialResult = async () => {
        const response = await reportService
            .getPatrimonialResult(
                DateUtils.currentDate()
            );
        setCurrentPatrimonialResult(response?.dto);
    }

    const retrieveYearStartPatrimonialResult = async () => {
        const response = await reportService
            .getPatrimonialResult(
                DateUtils.startOfYearDate()
            );
        setYearStartPatrimonialResult(response?.dto);
    }



    const setDateState = async ( value:string, setFunc:Function ) => {
        // console.log("> Value to set: ", value);
        // let valueToSet = value;
        setFunc(value)
    }


    // Date state
    const [economicFrom, setEconomicFrom] = useState();
    const [economicTo, setEconomicTo] = useState();
    const [patrimonialDate, setPatrimonialDate] = useState();


    const retrieveEconomicResult = async () => {

        const from = DateUtils.parse(economicFrom) ?? DateUtils.startOfMonthDate();
        const to = DateUtils.parse(economicTo) ?? DateUtils.currentDate();

        const response = await reportService.getEconomicResult(from, to);
        setEconomicResult(response?.dto);
    };

    const retrievePatrimonialResult = async () => {

        // console.log("> patrimonial_state: ", {patrimonialDate});

        const ref = DateUtils.parse(patrimonialDate) ?? DateUtils.currentDate();

        // console.log("> patrimonial_filter: ", {ref})

        const response = await reportService.getPatrimonialResult(ref);
        setPatrimonialResult(response?.dto);
    };






    React.useEffect(()=>{
        retrieveEconomicResult();
        retrievePatrimonialResult();
        retrieveCurrentMonthEconomicResult();
        retrieveCurrentYearEconomicResult();
        retrieveCurrentPatrimonialResult();
        retrieveYearStartPatrimonialResult();
    }, [])


     const CardAmount = ({ title, description, amount, styled }
                         : { title: string; description: string; amount: number; styled:boolean|undefined }) => {

        let colorClass="";
        if(styled) {
            colorClass = amount >= 0 ? "text-green-600" : "text-red-600";
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2`}>
                        <BulletNature
                            nature={amount >= 0 ? CategoryNature.R : CategoryNature.C}
                            blinking={true} />
                        {title}
                    </CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
                <CardContent className={`flex justify-end items-center ${colorClass}`}>
                    <span>{CurrencyEur.getInstance().format(amount)}</span>
                </CardContent>
            </Card>
        );
     }


    return (
        <div className="space-y-8 w-full bg-background text-foreground">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Benvenuto in Personal Finance</h1>
                <p className="text-muted-foreground">Gestisci le tue finanze con semplicità!</p>
            </div>

            <div className="w-full flex justify-between gap-4">

                <div className="w-full grid grid-cols-1 gap-4">
                    <CardAmount styled={true} title="Risultato mese corrente:" description={DateUtils.getMonthName(DateUtils.currentDate()) + " " + DateUtils.currentYearAsString()} amount={currentMonthEconomicResult?.totalResult ?? 0} />
                    <CardAmount styled={true} title="Risultato anno corrente:" description={DateUtils.currentYearAsString()} amount={currentYearEconomicResult?.totalResult ?? 0} />
                </div>

                <div className="w-full grid grid-cols-1 gap-4">
                    <CardAmount styled={false} title="Patrimonio corrente:" description={DateUtils.formatDate(DateUtils.currentDate())} amount={currentPatrimonialResult?.totalAmount ?? 0} />
                    <CardAmount styled={false} title="Patrimonio inzio anno:" description={DateUtils.currentYearAsString()} amount={yearStartPatrimonialResult?.totalAmount ?? 0} />
                </div>

            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Risultato Economico</CardTitle>
                    <CardDescription>Seleziona intervallo di date</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div>
                            <label>Da: </label>
                            <input
                                type="date"
                                value={economicFrom ?? DateUtils.formatDate(DateUtils.startOfMonthDate())}
                                onChange={e => setDateState(e.target.value, setEconomicFrom)}
                                className="border rounded px-2 py-1"
                            />
                        </div>
                        <div>
                            <label>A: </label>
                            <input
                                type="date"
                                value={economicTo ?? DateUtils.formatDate(DateUtils.currentDate())}
                                onChange={e => setDateState(e.target.value, setEconomicTo)}
                                className="border rounded px-2 py-1"
                            />
                        </div>
                        <Button onClick={retrieveEconomicResult}>Applica</Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                        {economicResult && (
                            <>
                                <CardAmount styled={false} title="Entrate:" description="" amount={economicResult.totalRevenues} />
                                <CardAmount styled={false} title="Uscite:" description="" amount={economicResult.totalCosts} />
                                <CardAmount styled={true} title="Saldo:" description="" amount={economicResult.totalResult} />
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Risultato Patrimoniale</CardTitle>
                    <CardDescription>Seleziona la data di riferimento</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div>
                            <label>Data: </label>
                            <input
                                type="date"
                                value={patrimonialDate ?? DateUtils.formatDate(DateUtils.currentDate())}
                                onChange={e => setDateState(e.target.value, setPatrimonialDate)}
                                className="border rounded px-2 py-1"
                            />
                        </div>
                        <Button onClick={retrievePatrimonialResult}>Applica</Button>
                    </div>
                    {patrimonialResult && (
                        <div className="mt-4">
                            <div className="font-bold my-4 flex justify-end">
                                Totale: {CurrencyEur.getInstance().format(patrimonialResult.totalAmount)}
                            </div>

                            <Table className="space-y-2">
                                <TableHeader className="hidden">
                                    <TableRow>
                                        <TableHead>Fondo</TableHead>
                                        <TableHead className="text-right">Importo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...patrimonialResult.listItems].length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Nessun movimento trovato per questo fondo
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        [...patrimonialResult.listItems]
                                            .sort((a, b) => b.amount - a.amount)
                                            .map((item, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{item.patrimonialFund?.label}</TableCell>
                                                    <TableCell className="text-right">{CurrencyEur.getInstance().format(item.amount)}</TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>

                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}