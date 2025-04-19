import NavBar from "@/app/components/NavBar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { verifyOwnership } from "@/app/service/simualationService";
import SimulationResult from "@/app/container/SimulationResult";

type ParamsType = {
    params: {
        id: string;
    };
};

export default async function SimulationPage({ params }) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const isOwner = await verifyOwnership(params.id, userId as string);

    if (!isOwner) {
        redirect("/notFound");
    }

    return (
        <>
            <NavBar />
            <SimulationResult id={params.id} />
        </>
    );
}
