import type CategoryNature from "@/components/common/bullet/CategoryNature.ts";
import BulletNature from "@/components/common/bullet/BulletNature.tsx";

export default function BulletAndLabelNature(
    {
        nature, textPrefix, textSuffix
    }
    : {
        nature: CategoryNature | null,
        textPrefix?: string,
        textSuffix?: string
    }
) {

    let label = "Costo";
    if ( nature?.toString()==="R" ) {
        label = "Ricavo";
    }

    return (
        <div className="flex items-center gap-2">
            <BulletNature nature={nature} blinking={false} />
            <span className="font-medium">
                {((textPrefix || "") + " " + label + " " + (textSuffix || "")).trim()}
            </span>
        </div>
    );
}