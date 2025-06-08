export default function BulletAndLabelNature(
    { nature }: { nature: "C" | "R" }) {

    let color = "bg-green-600";
    let label = "Ricavo";

    if(nature==="C") {
        color = "bg-red-600";
        label = "Costo";
    }

    return (
        <div className="flex items-center gap-2">
            <div className={`w-4 text-white font-medium h-4 rounded-full ${color}`}></div>
            <span className="font-medium">
                {label}
            </span>
        </div>
    );
}