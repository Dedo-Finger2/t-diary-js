import { DiaryPageCards } from "../components/DiaryPagesCards";
import { Sidebar } from "../components/Sidebar";

export function ListAllDiaryPagesPage() {
  return (
    <div className="main-container">
      <Sidebar />
      <div className="middle-container">
        <DiaryPageCards />
      </div>
      <h1>Teste</h1>
    </div>
  );
}
