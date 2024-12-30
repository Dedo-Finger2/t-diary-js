import { createRoot } from "react-dom/client";
import "./index.css";
import { HomePage } from "./pages/Home.page";
import { BrowserRouter, Route, Routes } from "react-router";
import { ConfigPage } from "./pages/Config.page";
import { TodayDiaryPage } from "./pages/TodayDiaryPage";
import { ListAllDiaryPagesPage } from "./pages/ListAllDiaryPages";
import { ShowDiaryPagePage } from "./pages/ShowDiaryPage";
import { ReadDiaryPage } from "./pages/ReadDiaryPage";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/today" element={<TodayDiaryPage />} />
        <Route path="/pages" element={<ListAllDiaryPagesPage />} />
        <Route path="/page/:path" element={<ShowDiaryPagePage />} />
        <Route path="/read" element={<ReadDiaryPage />} />
        <Route path="/config" element={<ConfigPage />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
