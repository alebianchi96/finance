import {Doughnut} from "react-chartjs-2";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import {Card} from "@/components/ui/card.tsx";
import React, {useState} from "react";
import type PatrimonialResultDto from "@/dto/finance/report/PatrimonialResultDto.ts";
import type PatrimonialReport from "@/dto/finance/report/model/PatrimonialReport.ts";
import ModalPatrimonialForm from "@/components/dashboard/ModalPatrimonialForm.tsx";

export default function PatrimonialStatusYear(
    { selectedYear, patrimonial }
    :  { selectedYear:string|undefined, patrimonial:PatrimonialReport } ) {

    // -----------------------------------------------------------
    // GRAFICO A TORTA
    // -----------------------------------------------------------
    const graphColors = [
        'rgb(255,99,132)',
        'rgb(54,162,235)',
        'rgb(255,205,86)',
        'rgb(75,192,192)',
        'rgb(153,102,255)',
        'rgb(255,159,64)',
        'rgb(201,203,207)',
        'rgb(255,99,71)',
        'rgb(60,179,113)',
        'rgb(100,149,237)',
        'rgb(218,112,214)',
        'rgb(255,215,0)',
        'rgb(34,139,34)',
        'rgb(70,130,180)',
        'rgb(199,21,133)',
        'rgb(244,164,96)',
        'rgb(46,139,87)',
        'rgb(123,104,238)',
        'rgb(240,128,128)',
        'rgb(112,128,144)'
    ]

    const [ graphData, setGraphData ] = useState<any>(buildGraphData( undefined ));

    const [ graphSize, setGraphSize ] = useState<any>({ h:'60%', w:'60%' });

    function buildGraphData( patrimonial:PatrimonialResultDto | undefined ) {

        let labels:string[] = ["TUTTI"];
        let data:number[] = [1];

        if ( patrimonial && patrimonial.listItems && patrimonial.listItems.length>0 ) {

            for( let item of patrimonial.listItems ) {
                labels.push( item.patrimonialFund.label );
                data.push( item.amount );
            }

        }

        return {
            labels: labels,
            datasets: [{
                label: ' € ',
                data: data,
                backgroundColor: graphColors,
                hoverOffset: 10
            }]
        }
    }

    React.useEffect(() => {
        const updateCenter = () => {
            setGraphSize(prev => ({ ...prev, h:'60%', w:'60%' }));
        };

        // sistema il grafico ad ogni ridimensionamento
        updateCenter();
        window.addEventListener('resize', updateCenter);
        return () => window.removeEventListener('resize', updateCenter);
    }, []);


    // -----------------------------------------------------------
    // MODAL PER DETTAGLIO PATRIMONIALE
    // -----------------------------------------------------------
    const [isModalPatrimonialOpen, setIsModalPatrimonialOpen] = useState(false);

    React.useEffect(()=>{
        patrimonial
            && patrimonial.patrimonialEndYear
            && setGraphData( buildGraphData( patrimonial.patrimonialEndYear ) );
    }, [patrimonial])


    return (
        <>
            <Card className="w-full lg:w-1/2 my-2  rounded-lg p-6 flex flex-col justify-between shadow-lg shadow-gray-600 hover:shadow-sm hover:shadow-white transition-shadow">
                <div className="text-2xl">
                    💰 Patrimonio anno: {selectedYear}
                </div>
                <div className={"py-3 lg:flex justify-center items-center w-full"}>
                    <div className={"h-1/2 lg:h-full lg:w-1/2 w-full flex justify-center items-center"}>
                        <Doughnut
                            data={graphData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                cutout: '65%',
                                plugins: {
                                    legend: { display: false },
                                    tooltip: { enabled: true }
                                }
                            }}
                            style={{
                                height: graphSize.h,
                                width: graphSize.w,
                                padding: '10px'
                            }}
                        />
                    </div>
                    <div className={"h-1/2 lg:h-full lg:w-1/2 w-full grid grid-cols-1 items-center"}>

                        <div className="h-fit py-1 items-center justify-center text-3xl">
                            <div onClick={()=>setIsModalPatrimonialOpen(true)}
                                 className={" flex tracking-normal " +
                                     "justify-center items-center gap-4" +
                                     "cursor-pointer"}
                                 title="Clicca per dettaglio patrimoniale 📊"
                            >
                                <div className={"cursor-pointer hover:border-b-2 hover:border-solid hover:border-gray-50 py-1"}>
                                    { CurrencyEur.formatOrNull( patrimonial?.patrimonialEndYear?.totalAmount ) }
                                    <span>👆🏻</span>
                                </div>
                                {/*
                                            <Button onClick={()=>setIsModalPatrimonialOpen(true)}
                                                    variant={"primary"}
                                                    className="cursor-pointer w-fit">📊</Button>
                                         */}
                            </div>
                            <div className=" lg:flex justify-center items-center gap-4  text-xl mt-4 text-gray-500">
                                <div className="flex justify-center items-center">Inizio anno:</div>
                                <div className="flex justify-center items-center">
                                    { CurrencyEur.formatOrNull( patrimonial?.patrimonialStartYear?.totalAmount ) }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="text-xl lg:flex justify-between gap-4">
                    <div>Risultato annuale:</div>
                    <div className={'text-right ' + (patrimonial?.yearResult < 0 ? 'text-red-500' : (patrimonial?.yearResult > 0 ? 'text-green-500' : '') )}>
                        {CurrencyEur.format(patrimonial?.yearResult)}
                    </div>
                </div>

            </Card>
            {isModalPatrimonialOpen && (
                <ModalPatrimonialForm
                    selectedYear={selectedYear}
                    onCancel={() => {
                        setIsModalPatrimonialOpen(false);
                    }}
                    patrimonial={patrimonial?.patrimonialEndYear}
                    isOpen={isModalPatrimonialOpen}
                    setIsOpen={setIsModalPatrimonialOpen}
                />
            )}
        </>
    );
}