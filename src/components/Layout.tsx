import NavHeader from "./NavHeader";
import "../styling/layout.css";
import React from "react";
type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-layout">
      <header className="nav-header">
        <NavHeader />
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
};

export default Layout;
