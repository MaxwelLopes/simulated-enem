"use client";

import NavBar from "@/app/components/NavBar";
import CreateSimulated from "@/app/container/CreateSimulated";

export const CreateSimulatedPage = ({}) => {
  return (
    <div>
      <NavBar />
      <div className="pt-16">
        <CreateSimulated />
      </div>
    </div>
  );
};

export default CreateSimulatedPage;