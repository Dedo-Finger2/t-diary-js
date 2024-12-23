import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const userConfigData = localStorage.getItem("userConfigData");
    if (userConfigData === null) navigate("/config");
  });

  return (
    <>
      <Navbar />
      <h1>Home</h1>
      <hr />
    </>
  );
}
