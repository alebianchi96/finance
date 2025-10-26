import type CategoryNature from "@/components/common/bullet/CategoryNature.ts";

export default function BulletNature(
    { nature, blinking, content }
    : {
        nature: CategoryNature | null,
        blinking:boolean,
        content?:string
    }) {

    let color = "bg-red-600";
    if ( nature?.toString()==="R" ) {
        color = "bg-green-600";
    } else if ( nature?.toString()==="F" ) {
        color = "bg-blue-600"
    } else if ( nature==null ) {
        color = "transparent"
    }

    let blinkClass = blinking ? "blinking-dot" : "";

    return (
        <div
            className={
                `w-4 
                    text-white 
                    font-medium h-4 
                    rounded-full 
                    ${color} 
                    ${blinkClass}
                    flex
                    items-center
                    justify-center`
            }>
            {content ?? ''}
        </div>
    );
}