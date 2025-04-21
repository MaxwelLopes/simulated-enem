"use client";

import NavBar from "@/app/components/NavBar";
import SimulatedList from "@/app/container/Simulateds";

const SimulationsPage = ({ }) => {
  return (
    <>
      <NavBar />
      <div className="pt-16">
        <SimulatedList />
      </div>
    </>
  );
};

export default SimulationsPage;
