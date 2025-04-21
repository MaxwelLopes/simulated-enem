"use client";

import NavBar from "@/app/components/NavBar";
import DashBoard from "@/app/container/DashBoard";

const CreatSimulatedPage = ({}) => {
  return (
    <div>
      <NavBar />
      <div className="pt-16">
        <DashBoard />
      </div>
    </div>
  );
};

export default CreatSimulatedPage;
