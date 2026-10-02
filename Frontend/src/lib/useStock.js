import { useEffect, useState } from "react";
import api from "./api";

// { "12": 40, "13": 0 }. Jis id ka number nahi mila wo "unlimited" maana jaata hai
export default function useStock() {
    const [stock, setStock] = useState({});

    useEffect(() => {
        let alive = true;
        const load = () =>
            api.get("/stock").then((r) => alive && setStock(r.data || {})).catch(() => { });
        load();
        const id = setInterval(() => !document.hidden && load(), 30000);
        return () => {
            alive = false;
            clearInterval(id);
        };
    }, []);

    return stock;
}