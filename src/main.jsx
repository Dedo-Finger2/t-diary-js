import { createRoot } from "react-dom/client";
import "./index.css";
import { HomePage } from "./pages/Home.page";
import { BrowserRouter, Route, Routes } from "react-router";
import { ConfigPage } from "./pages/Config.page";
import { TodayDiaryPage } from "./pages/TodayDiaryPage";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/today" element={<TodayDiaryPage />} />
      <Route path="/config" element={<ConfigPage />} />
    </Routes>
  </BrowserRouter>
);
