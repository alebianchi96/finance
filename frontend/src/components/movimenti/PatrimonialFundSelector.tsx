import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import CurrencyEur from "@/lib/CurrencyEur.ts";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";
import {Input} from "@/components/ui/input.tsx";
import React from "react";
import BulletAndLabelNature from "@/components/common/bullet/BulletAndLabelNature.tsx";
import CategoryNature from "@/components/common/bullet/CategoryNature.ts";

interface PatrimonialFundSelectorProps {
    patrimonialFunds : PatrimonialFundDto[];
    selectedFundId : string;
    selectedFundAmount : number,
    setSelectedFundId : Function,
    handleAddMovement : Function
}

export default function PatrimonialFundSelector (
    {
        patrimonialFunds,
        selectedFundId,
        selectedFundAmount,
        setSelectedFundId,
        handleAddMovement
    } : PatrimonialFundSelectorProps) {

    const NO_FUND_FOUND = (<>Nessun fondo patrimoniale trovato</>);

    const [realFundAmount, setRealFundAmount] = React.useState<number>(0);
    const [lastSelectedFundId, setLastSelectedFundId] = React.useState<string>(selectedFundId);

    React.useEffect(
        ()=>{
            // ogni volta che cambia il fondo patrimoniale selezionato, resetto l'importo reale
            if(lastSelectedFundId !== selectedFundId) {
                setLastSelectedFundId(selectedFundId)
                setRealFundAmount(selectedFundAmount);
            }
        },
        [selectedFundAmount]
    )


    function FundButton({i}:{i:PatrimonialFundDto}) {

        let isSelected = selectedFundId === i.id.toString();

        return (
            <Button
                variant={isSelected ? "default" : "outline"}
                key={i.id}
                style={{ "minWidth":'200px', "cursor":'pointer' }}
                className={"p-7 " + (isSelected ? ' bg-primary ' : ' bg-card')}
                onClick={() => setSelectedFundId(i.id.toString())}
            >
                {
                    isSelected && (selectedFundAmount || selectedFundAmount==0) ?
                        (
                            <div className="">
                                <div>{i.label}</div>
                                <div>{CurrencyEur.format(selectedFundAmount)}</div>
                            </div>
                        )
                        : i.label
                }
            </Button>
        );
    }


    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Seleziona Fondo Patrimoniale</CardTitle>
            </CardHeader>
            <CardContent>
                { /* Lista dei fondi patrimoniali */ }
                <div className="flex gap-4 w-full flex-wrap justify-center lg:justify-start">
                    {
                        patrimonialFunds?.length > 0 ? (
                            patrimonialFunds?.map(( i )=>(
                                <FundButton i={i} key={i.id}/>
                            ))
                        )
                        :NO_FUND_FOUND
                    }
                    { /* Seleziona Fondo Patrimoniale => SERVE PER IL CORRETTO FUNZIONAMENTO ANCHE SE NASCOSTO */ }
                    <div className="hidden">
                        <Select value={selectedFundId} onValueChange={(value) => setSelectedFundId(value)}>
                            <SelectTrigger className="w-full"> <SelectValue placeholder="Seleziona un fondo" /> </SelectTrigger>
                            <SelectContent> {patrimonialFunds.map(fund => (
                                <SelectItem key={fund.id} value={fund.id.toString()}>
                                    <div style={{
                                        borderRadius:'50px',
                                        width:'30px',
                                        height:'30px'
                                    }}
                                         className={
                                             `text-white font-medium flex items-center justify-center bg-blue-600`
                                         }>
                                        F
                                    </div>
                                    <div>
                                        {fund.label}
                                    </div>
                                </SelectItem>
                            ))} </SelectContent>
                        </Select>
                    </div>
                </div>

                { /* Importi calcoli */ }
                { selectedFundId ? (
                    <>
                        <div className="mt-4 md:flex gap-4">
                            <div className="lg:w-1/3">
                                <LabelCalculatedAmount
                                    type={TypeCalculatedAmount.REC}
                                    realFundAmount={realFundAmount}
                                    selectedFundAmount={selectedFundAmount}/>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="recAmount"
                                        type="text"
                                        className="text-right bg-muted"
                                        readOnly
                                        value={ CurrencyEur.format( selectedFundAmount ) }
                                    />
                                </div>
                            </div>
                            <div className="lg:w-1/3">
                                <LabelCalculatedAmount
                                    type={TypeCalculatedAmount.REAL}
                                    realFundAmount={realFundAmount}
                                    selectedFundAmount={selectedFundAmount}/>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="realAmount"
                                        type="number"
                                        step="0.01"
                                        className="text-right tracking-wider"
                                        value={ realFundAmount }
                                        onChange={ (e) => setRealFundAmount( parseFloat(e.target.value) ) }
                                    />
                                </div>
                            </div>

                            <div className="lg:w-1/3">
                                <LabelCalculatedAmount
                                    type={TypeCalculatedAmount.CALC}
                                    realFundAmount={realFundAmount}
                                    selectedFundAmount={selectedFundAmount}/>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="calculatedAmount"
                                        type="text"
                                        className="text-right bg-muted"
                                        readOnly
                                        value={ CurrencyEur.format( realFundAmount-selectedFundAmount ) }
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (<></>)}

            </CardContent>
        </Card>
        { /* Bottoni per aggiungi */ }
        <div className="flex flex-wrap justify-center gap-4 py-4">
            <AddCostOrRevenueButton
                handleAddMovement={handleAddMovement}
                selectedFundId={selectedFundId}
                categoryNature={CategoryNature.C}
            />
            <AddCostOrRevenueButton
                handleAddMovement={handleAddMovement}
                selectedFundId={selectedFundId}
                categoryNature={CategoryNature.R}
            />
        </div>
        </>
    )
}

/* Componente per bottone aggiungi costo/ricavi */
function AddCostOrRevenueButton({
    handleAddMovement, selectedFundId, categoryNature
}: { handleAddMovement:Function, selectedFundId:string, categoryNature:CategoryNature }) {

    return (
        <Button
            onClick={()=>handleAddMovement( categoryNature.toString() )}
            disabled={!selectedFundId} >
            <BulletAndLabelNature nature={categoryNature} textPrefix={"Aggiungi"} />
        </Button>
    );
}

/* Componente Label per importi calcolati */
enum TypeCalculatedAmount { REC='REC' , REAL='REAL' , CALC='CALC' };
function LabelCalculatedAmount({type, realFundAmount, selectedFundAmount} : {type: TypeCalculatedAmount, selectedFundAmount : number, realFundAmount:number}) {

    const calculatedAmountLabel = (realFundAmount:number, selectedFundAmount:number)=>{
        return (
            <div className="flex items-center gap-2">
                <span>Transazioni da registrare:</span>
                <span>
                    {
                        (realFundAmount-selectedFundAmount) == 0 ?
                            '' : <BulletAndLabelNature
                                    nature={(realFundAmount-selectedFundAmount) > 0 ?
                                        CategoryNature.R : CategoryNature.C} />
                    }
                </span>
            </div>
        )
    }

    const attributes = {
        REC: {
            fieldId:"recAmount",
            text: 'Importo registrato:'
        },
        REAL: {
            fieldId:"realAmount",
            text: 'Importo realmente posseduto:'
        },
        CALC: {
            fieldId:"calculatedAmount",
            text: calculatedAmountLabel(realFundAmount, selectedFundAmount)
        }
    }

    return (
        <span className="mb-3">{ attributes[type].text }</span>
    );
}