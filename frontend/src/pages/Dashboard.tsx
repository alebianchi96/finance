// src/pages/Dashboard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ReportService from "@/service/ReportService.ts";
import EconomicAccountDto from "@/dto/finance/report/EconomicResultDto.ts";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import type PatrimonialResultDto from "@/dto/finance/report/PatrimonialResultDto.ts";
import DateUtils from "@/lib/DateUtils.ts";
import moment from "moment";

export default function Dashboard() {

/*

-> Sistema date su input dei risultati (problema con fuso) / testare le chiamate che passino le date giuste

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
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), 1);
        const to = new Date(now.getFullYear(), now.getMonth()+1, 0);
        const response = await reportService.getEconomicResult(from, to);
        setCurrentMonthEconomicResult(response?.dto);
    }

    const retrieveCurrentYearEconomicResult = async () => {
        const now = new Date();
        const from = new Date(now.getFullYear(), 0, 1);
        const to = new Date(now.getFullYear()+1, 0, 0);
        const response = await reportService.getEconomicResult(from, to);
        setCurrentYearEconomicResult(response?.dto);
    }

    const retrieveCurrentPatrimonialResult = async () => {
        const ref = new Date();
        const response = await reportService.getPatrimonialResult(ref);
        setCurrentPatrimonialResult(response?.dto);
    }

    const retrieveYearStartPatrimonialResult = async () => {
        const ref = new Date(new Date().getFullYear(), 0, 0);
        const response = await reportService.getPatrimonialResult(ref);
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

    const getStartOfMonthDate = ()=>{
        let startMonth = new Date();
        startMonth.setDate(1);
        return startMonth;
    }

    const retrieveEconomicResult = async () => {

        // console.log("> economic_state: ", { economicFrom, economicTo });

        let startMonth = getStartOfMonthDate();
        let now = new Date();

        const from = DateUtils.parse(economicFrom) ?? startMonth;
        const to = DateUtils.parse(economicTo) ?? now;

        // console.log("> economic_date: ", { from, to });

        const response = await reportService.getEconomicResult(from, to);
        setEconomicResult(response?.dto);
    };

    const retrievePatrimonialResult = async () => {

        // console.log("> patrimonial_state: ", {patrimonialDate});

        const ref = DateUtils.parse(patrimonialDate) ?? new Date();

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

        const dotClasses = "w-4 text-white font-medium h-4 rounded-full blinking-dot";

        const RED_DOT = <div className={`${dotClasses} bg-red-600`}></div>

        const GREEN_DOT = <div className={`${dotClasses} bg-green-600`}></div>

        let DTO_OBJ = <></>

        let colorClass="";
        if(styled) {
            colorClass = amount >= 0 ? "text-green-600" : "text-red-600";
            DTO_OBJ = amount >= 0 ? GREEN_DOT : RED_DOT;
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2`}>
                        {DTO_OBJ}
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
                <h1 className="text-4xl font-bold mb-2">Benvenuto nella tua App di Finanza Personale</h1>
                <p className="text-muted-foreground">Gestisci i tuoi fondi, movimenti e categorie economiche</p>
            </div>

            <div className="w-full flex justify-between gap-4">

                <div className="w-full grid grid-cols-1 gap-4">
                    <CardAmount styled={true} title="Risultato mese corrente:" description={DateUtils.getMonthName(new Date()) + " " + new Date().getFullYear().toString()} amount={currentMonthEconomicResult?.totalResult ?? 0} />
                    <CardAmount styled={true} title="Risultato anno corrente:" description={new Date().getFullYear().toString()} amount={currentYearEconomicResult?.totalResult ?? 0} />
                </div>

                <div className="w-full grid grid-cols-1 gap-4">
                    <CardAmount styled={false} title="Patrimonio corrente:" description={DateUtils.formatDate(new Date())} amount={currentPatrimonialResult?.totalAmount ?? 0} />
                    <CardAmount styled={false} title="Patrimonio inzio anno:" description={new Date().getFullYear().toString()} amount={yearStartPatrimonialResult?.totalAmount ?? 0} />
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
                                value={economicFrom ?? DateUtils.formatDate(getStartOfMonthDate())}
                                onChange={e => setDateState(e.target.value, setEconomicFrom)}
                                className="border rounded px-2 py-1"
                            />
                        </div>
                        <div>
                            <label>A: </label>
                            <input
                                type="date"
                                value={economicTo ?? DateUtils.formatDate(new Date())}
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
                                value={patrimonialDate ?? DateUtils.formatDate(new Date())}
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
                            <div className="space-y-2">
                                {[...patrimonialResult.listItems]
                                    .sort((a, b) => b.amount - a.amount)
                                    .map((item, idx) => (
                                        <div key={idx} className="flex justify-between border-b pb-1">
                                            <span>{item.patrimonialFund?.label}</span>
                                            <span>{CurrencyEur.getInstance().format(item.amount)}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Amministrazione</CardTitle>
                        <CardDescription>Gestisci categorie, account e fondi patrimoniali</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate("/amministrazione")} className="w-full">
                            Accedi
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Movimenti</CardTitle>
                        <CardDescription>Visualizza e gestisci i movimenti finanziari</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate("/movimenti")} className="w-full">
                            Accedi
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Trasferimenti</CardTitle>
                        <CardDescription>Gestisci trasferimenti tra fondi patrimoniali</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate("/trasferimenti")} className="w-full">
                            Accedi
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}