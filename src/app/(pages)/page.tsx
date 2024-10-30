"use client";

import NavBar from "@/app/components/NavBar";
import Home from "../container/home";

export const SimulationsPage = () => {
  return (
    <>
      <NavBar />
      <div className="pt-16">
        <Home/>
      </div>
    </>
  );
};

export default SimulationsPage;
