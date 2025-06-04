// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Amministrazione from "@/pages/Amministrazione";
import Movimenti from "@/pages/Movimenti";
import Trasferimenti from "@/pages/Trasferimenti";
import "./index.css";

export function App() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="amministrazione" element={<Amministrazione />} />
                        <Route path="movimenti" element={<Movimenti />} />
                        <Route path="trasferimenti" element={<Trasferimenti />} />
                    </Route>
                </Routes>
            </BrowserRouter>
    );
}

export default App;