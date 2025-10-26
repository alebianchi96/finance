import {Card} from "@/components/ui/card.tsx";
import {Eye} from "lucide-react";
import {Link} from "react-router-dom";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import React from "react";
import type VEconomicResultDetailDto from "@/dto/finance/report/view/VEconomicResultDetailDto.ts";
import type VEconomicResultDto from "@/dto/finance/report/view/VEconomicResultDto.ts";
import DateUtils from "@/lib/DateUtils.ts";

export default function BilanceYear({
        selectedYear, vEconomicDetailResult, vEconomicResult, setVEconomicDetailResult
    }:{
        selectedYear:string,
        vEconomicDetailResult:VEconomicResultDetailDto[] | undefined,
        vEconomicResult:VEconomicResultDto[] | undefined,
        setVEconomicDetailResult:Function
    }) {

    function isCategoryRow( detail: VEconomicResultDetailDto ): boolean {
        if(detail && detail.economicAccount.trim()) { return false; }
        return true;
    }

    /**
     * Le righe per categoria si vedono sempre.
     *
     * Le righe per conto economico si vedono solo se show=true <il settaggio avviene a livello di categoria>.
     *
     * */
    function getEconomicDetailVisibilityCssClass( isCategoryRow: boolean, show: boolean ): string {
        return isCategoryRow ? ' bg-card  ' : ( show ? ' block ' : ' hidden ');
    }

    function toggleVisibilityByCategory( category:string | undefined ) {
        if( !category || !vEconomicDetailResult ) { return; }

        let updatedDetails = vEconomicDetailResult.map( detail => {
            if( detail.economicCategory === category && !isCategoryRow(detail) ) {
                return {
                    ...detail,
                    show: !detail.show
                }
            } else if ( detail.economicCategory === category ) {
                return {
                    ...detail,
                    opened: !detail.opened
                }
            }
            return detail;
        });

        setVEconomicDetailResult( updatedDetails );
    }


    function getCssClass( detail: VEconomicResultDetailDto ): string {

        let commonClasses = " gap-4 min-h-16 max-h-16 flex items-center border-solid hover:font-bold ";

        if( isCategoryRow(detail) ) {

            let classesByNature = " "; // bg-card
            if( detail.totalForYear > 0 ) {
                classesByNature = " text-green-500 "; // bg-green-900
            } else if ( detail.totalForYear < 0 ) {
                classesByNature = " text-red-500 "; // bg-red-900
            }
            // text-white
            return classesByNature + " font-semibold " + commonClasses;

        }
        return "bg-transparent text-gray-400 " + commonClasses;
    }

    function formatAndNilCurrency( amount : number ) {
        if( amount===null || amount===undefined || isNaN(amount) || amount===0 ) {
            return "-"
        }
        return CurrencyEur.format(amount);
    }

    function buildId( detail: VEconomicResultDetailDto ) {
        return (detail.economicCategory ?? '') + (detail.economicAccount ?? '');
    }

    const months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'sett', 'ott', 'nov', 'dic'];


    /*
    * =============================
    *   gestione barra scorrimento
    * =============================
    * */
    const monthsContainerRef = React.useRef<HTMLDivElement | null>(null);

    function getCurrentMonthBackground( monthIndex:number ) : string {

        function isCurrentMonth(monthIndex: number) : boolean {
            if(!monthIndex) { return false; }

            // sto visualizzando l'anno corrente?
            const currentYear = DateUtils.currentYearAsString();
            if (selectedYear !== currentYear) {
                return false;
            }
            const targetIndex = DateUtils.getMonthIndex(new Date()); // mese corrente
            const icm = monthIndex === targetIndex;

            return icm;
        }

        let bgColumn = ' bg-transparent ';
        if( isCurrentMonth(monthIndex) ) {
            bgColumn = ' bg-card rounded-full ';
        }
        return bgColumn;
    }

    function moveHorizontalScroll() {
        const container = monthsContainerRef.current;
        if (!container) return;

        // sto visualizzando l'anno corrente?
        const currentYear = DateUtils.currentYearAsString();
        if (selectedYear !== currentYear) {
            container.scrollLeft = 0; // torna all'inizio
            return;
        }

        const targetIndex = DateUtils.getMonthIndex(new Date()); // mese corrente
        const monthEls = container.querySelectorAll<HTMLElement>('.month-col');

        if (monthEls.length > targetIndex) {
            const target = monthEls[targetIndex];
            // centra l'elemento nel container
            const left = target.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2);
            container.scrollLeft = left;
        }
    }
    React.useEffect(moveHorizontalScroll, [vEconomicDetailResult]);



    return (
        <div className="w-full gap-4">
            <Card className="w-full my-2  rounded-lg p-6 flex flex-col justify-between shadow-lg shadow-gray-600 hover:shadow-sm hover:shadow-white transition-shadow">
                <div className="text-2xl">
                    💰 Bilancio: {selectedYear}
                </div>
                <div className={"py-3 w-full"}>
                    <div className="flex">
                        {/* TOGGLE DETAIL BUTTON */}
                        <div className="w-1/24">
                            <div className="font-medium py-4 flex items-center justify-center mb-2 "><Eye className="text-xs"/></div>
                            {vEconomicDetailResult?.map(detail => {
                                    let isCatRow = isCategoryRow(detail);
                                    let visibleOrNotClass = getEconomicDetailVisibilityCssClass( isCatRow, detail.show );

                                    let catIcon = detail.opened ? (<>➖</>) : (<>➕</>);

                                    return (
                                        <div key={buildId(detail)} className={getCssClass(detail) + visibleOrNotClass + " flex items-center justify-center bg-transparent "}>
                                            {<Link onClick={()=>toggleVisibilityByCategory( detail.economicCategory )}>{ isCatRow ? (<>{catIcon}</>) : (<div className={"text-transparent"}>➜</div>) }</Link>}
                                        </div>

                                    )
                                }
                            )}
                        </div>
                        {/* CATEGORIE */}
                        <div className="w-7/24">
                            <div className="font-medium py-4 mb-2 ">CATEGORIA</div>
                            {vEconomicDetailResult?.map(detail => {
                                    let isCatRow = isCategoryRow(detail);
                                    let visibleOrNotClass = getEconomicDetailVisibilityCssClass( isCatRow, detail.show );
                                    return (
                                        <div key={buildId(detail)} className={getCssClass(detail) + visibleOrNotClass + " bg-card pl-2 "}>
                                            {
                                                isCatRow ? detail.economicCategory : detail.economicAccount
                                            }
                                        </div>
                                    )
                                }
                            )}
                        </div>

                        {/* TOTALE ANNO */}
                        <div className="w-1/6 text-right">
                            <div className="font-medium pr-2 py-4 mb-2 ">TOTALE ANNO</div>
                            {vEconomicDetailResult?.map(detail => {
                                    let isCatRow = isCategoryRow(detail);
                                    let visibleOrNotClass = getEconomicDetailVisibilityCssClass( isCatRow, detail.show );
                                    return (
                                        <div
                                            key={buildId(detail)}
                                            className={getCssClass(detail) + visibleOrNotClass + " justify-end border-r-2 pr-2 bg-card "}>
                                            {CurrencyEur.format(detail.totalForYear)}
                                        </div>
                                    )
                                }
                            )}
                        </div>

                        {/* MESI E RELATIVI TOTALI */}
                        <div className="w-1/2 ml-2 overflow-x-auto"  ref={monthsContainerRef}>
                            <div className="min-w-max">
                                <div className="flex flex-nowrap gap-4 ">
                                    {
                                        months.map((m, ix)=>{

                                            let er = vEconomicResult?.find(er=>er.monthIndex === (ix+1).toString());
                                            return (
                                                <div key={m+ix} className={"month-col cursor-pointer flex-shrink-0 w-30 text-center font-medium py-4  mb-2 " + getCurrentMonthBackground(ix)}>
                                                    <Tooltip key={m}>
                                                        <TooltipTrigger asChild>
                                                                <span>
                                                                    {m}
                                                                </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="p-4">
                                                            <p className="mb-2">Totali mensili:</p>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className={""}>📈 Ricavi:</div>
                                                                <div className={"flex justify-end text-green-500"}>{CurrencyEur.format(er?.totaleRicavi)}</div>
                                                                <div className={""}>📉 Costi:</div>
                                                                <div className={"flex justify-end text-red-500 "}>{CurrencyEur.format(er?.totaleCosti)}</div>
                                                            </div>
                                                            <div className="my-2 border-b-2 border-solid border-gray-800" > </div>
                                                            <div className={
                                                                "flex justify-end font-bold " + (er?.totale < 0 ? 'text-red-500' : (er?.totale > 0 ? 'text-green-500' : 'text-gray-500'))}>
                                                                {CurrencyEur.format(er?.totale)}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                {vEconomicDetailResult?.map(detail => {
                                    let isCatRow = isCategoryRow(detail);
                                    let visibleOrNotClass = getEconomicDetailVisibilityCssClass( isCatRow, detail.show );
                                    return(
                                        <div className={"flex flex-nowrap items-center " + getCssClass(detail) + visibleOrNotClass}
                                             key={buildId(detail)}>
                                            {
                                                months.map((m, ix)=>{

                                                        return (
                                                            <div key={m+ix+"2"} className={"flex-shrink-0 w-30 text-right pr-2 border-r-1 " + getCurrentMonthBackground(ix)}>
                                                                {formatAndNilCurrency(detail[m])}
                                                            </div>
                                                        )
                                                    }
                                                )
                                            }
                                        </div>
                                    )}
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </Card>

        </div>
    )
}