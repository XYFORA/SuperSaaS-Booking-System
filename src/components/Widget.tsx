"use client";
import { useEffect, useRef } from "react";

const SuperSaaSWidget = () => {

    const widgetRef = useRef<any>(null);

    useEffect(() => {

        const script = document.createElement("script");

        script.src = "https://cdn.supersaas.net/widget.js";

        script.async = true;

        script.onload = () => {
            widgetRef.current = new (window as any).SuperSaaS(
                "613529:Ahmed_Saleem_Shaikh",
                "814228:Testing_Schedule_Appointment",
                { view: "week" }, { refresh: 10 }
            );
        };

        document.body.appendChild(script);

        return () => {

            document.body.removeChild(script);

        };

    }, []);

    const openWidget = () => {

        if (widgetRef.current) {

            widgetRef.current.show();

        } else {

            console.warn("SuperSaaS Widget Not Loaded Yet!");

        }

    };

    return (
        <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition shadow-lg"
            onClick={openWidget}
        >
            Book Now
        </button>
    );
};

export default SuperSaaSWidget;