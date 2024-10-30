"use client";

import NavBar from "@/app/components/NavBar";
import CreateSimulated from "@/app/container/CreateSimulated";

export const CreatSimulatedPage = () => {
  return (
    <div>
      <NavBar />
      <div className="pt-16">
        <CreateSimulated />
      </div>
    </div>
  );
};

export default CreatSimulatedPage;
