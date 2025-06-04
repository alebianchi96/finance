// src/pages/Dashboard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 w-full bg-background text-foreground">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Benvenuto nella tua Finanza Personale</h1>
                <p className="text-muted-foreground">Gestisci i tuoi fondi, movimenti e categorie economiche</p>
            </div>

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