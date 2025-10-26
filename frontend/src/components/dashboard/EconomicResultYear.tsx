import type VEconomicResultDto from "@/dto/finance/report/view/VEconomicResultDto.ts";
import BulletNature from "@/components/common/bullet/BulletNature.tsx";
import CategoryNature from "@/components/common/bullet/CategoryNature.ts";
import DateUtils from "@/lib/DateUtils.ts";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import {Card} from "@/components/ui/card.tsx";
import React from "react";

export default function EconomicResultYear(
    { selectedYear, vEconomicResult, avgEconomicResult }
    :  { selectedYear:string|undefined, vEconomicResult:VEconomicResultDto[] | undefined,  avgEconomicResult:number | undefined }
) {

    const Semestre = ( { semestreNumero } : { semestreNumero:number }  ) => {

        let listOfMonthsToInclude = semestreNumero===1 ? [1,2,3,4,5,6] : [7,8,9,10,11,12];

        return (

            <div className={"h-1/2 lg:h-full w-full lg:w-1/2"}>
                <div className="text-2xl mb-4">{semestreNumero}° semestre:</div>
                {
                    vEconomicResult?.filter( ix => listOfMonthsToInclude.indexOf(Number.parseInt(ix.monthIndex))>=0 ).map(
                        (
                            item:VEconomicResultDto,
                            idx:number
                        )=> {


                            let formattedAsNumber = Number.parseInt(item.monthIndex)
                            if( !formattedAsNumber || isNaN(formattedAsNumber) ) {
                                return <></>
                            }

                            return (
                                <div key={idx} className={"hover:px-2 py-2 hover:shadow-sm shadow-gray-600 rounded-4xl flex justify-between "
                                    + (item.totale < 0 ? 'text-red-500' : (item.totale > 0 ? 'text-green-500' : 'text-gray-500') )}>
                                    <div className="flex items-center gap-2">
                                        {
                                            (item.totale > 0 || item.totale < 0) ?
                                                <BulletNature
                                                    nature={item.totale > 0 ? CategoryNature.R : item.totale < 0 ? CategoryNature.C : null}
                                                    blinking={true}/>
                                                :
                                                <></>
                                        }
                                        {item.monthIndex + ". " + DateUtils.getMonthNameByIndex112(item.monthIndex)}
                                    </div>
                                    <div className={"flex items-center justify-end "}>
                                        {CurrencyEur.format(item.totale)}
                                    </div>
                                </div>
                            )
                        }
                    )
                }
            </div>

        )

    }

    return (
        <Card className="w-full lg:w-1/2 my-2 rounded-lg p-6 flex flex-col justify-between shadow-lg shadow-gray-600 hover:shadow-sm hover:shadow-white transition-shadow">
            <div className="text-2xl">
                🎯 Dettaglio risultati mensili: {selectedYear}
            </div>
            <div className="py-12 lg:flex items-stretch w-full gap-4">
                <Semestre semestreNumero={1} />
                <Semestre semestreNumero={2} />
            </div>


            <div className="text-xl lg:flex justify-between gap-4">
                <div>Risultato medio mensile:</div>
                <div className={'text-right ' + (avgEconomicResult < 0 ? 'text-red-500' : (avgEconomicResult > 0 ? 'text-green-500' : '') )}>
                    {CurrencyEur.format(avgEconomicResult)}/mese
                </div>
            </div>

        </Card>

    )
}