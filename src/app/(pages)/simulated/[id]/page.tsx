import NavBar from "@/app/components/NavBar";
import { Simulation } from "@/app/container/simulation";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { verifyOwnership } from "@/app/service/simualationService";

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

