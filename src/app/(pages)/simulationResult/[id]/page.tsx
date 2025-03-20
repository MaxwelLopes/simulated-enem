"use client";

import NavBar from "@/app/components/NavBar";
import SimulationResult from "@/app/container/SimulationResult";

type ParamsType = {
    params: {
        id: string;
    };
};

export const SimulationPage = ({ params }: ParamsType) => {
    return (
        <>
            <NavBar />
            <SimulationResult id={params.id} />
        </>
    );
};

export default SimulationPage;


