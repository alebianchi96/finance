import {Button} from "@/components/ui/button.tsx";
import {DISABLED_BTN_CLASS, isActivePrevButton, isActiveSuccButton} from "@/dto/finance/pagination/PaginationUtils.ts";
import MovementDto from "@/dto/finance/MovementDto.ts";
import type PaginationData from "@/dto/finance/pagination/PaginationData.ts";

interface PaginationComponentProps {
    movements:MovementDto[] | undefined;
    paginationData : PaginationData | undefined;
    addPage:Function;
    subtractPage:Function;
}

export default function PaginationComponent({
    movements,
    paginationData,
    addPage,
    subtractPage
} : PaginationComponentProps) {
    return (
        <>
        { movements?.length > 0 ?
            (
                <div className="py-4 h-2 w-full flex items-center justify-center rounded">
                    <div className="w-1/3 ">
                        <Button
                            className={ isActivePrevButton(paginationData) ? DISABLED_BTN_CLASS:"" }
                            disabled={ isActivePrevButton(paginationData) }
                            onClick={subtractPage}>
                            Prec.
                        </Button>
                    </div>
                    <div className="w-1/3 flex justify-center">
                        {
                            paginationData?.currentPage && paginationData?.totalPages ?
                                (
                                    <>
                                    Pag. { (paginationData?.currentPage ?? 0) } di { (paginationData?.totalPages ?? 0) }
                                    </>
                                )
                                : (<></>)
                        }
                    </div>
                    <div className="w-1/3 flex justify-end">
                        <Button
                            className={ isActiveSuccButton(paginationData) ? DISABLED_BTN_CLASS:"" }
                            disabled={ isActiveSuccButton(paginationData) }
                            onClick={addPage}>
                            Succ.
                        </Button>
                    </div>
                </div>
            )
            :
            (<></>)
        }
        </>
    )
}