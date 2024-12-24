import { DiaryPageTable } from "../components/DiaryPageTable";
import { Navbar } from "../components/Navbar";

export function ListAllDiaryPagesPage() {
  return (
    <>
      <Navbar />
      <h1>Diary Pages</h1>
      <hr />
      <DiaryPageTable />
    </>
  );
}
