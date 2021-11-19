import React from "react";
import Sidebar from "../components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full h-[100vh]">
      <div className="flex w-full h-full">
        <Sidebar />
        <div className="h-full w-[80px]" />
        <div className="w-full">
          <div className="layout">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
