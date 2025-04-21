import NavBar from "@/app/components/NavBar";
import { Simulation } from "@/app/container/simulation";
import { redirect } from "next/navigation";

import { verifyOwnership } from "@/app/service/simualationService";;
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
      <Simulation id={params.id} />
    </>
  );
};

