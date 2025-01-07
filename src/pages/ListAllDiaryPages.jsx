import { DiaryPageCards } from "../components/DiaryPagesCards";
import { Sidebar } from "../components/Sidebar";

export function ListAllDiaryPagesPage() {
  return (
    <div className="main-container">
      <Sidebar />
      <div className="middle-container">
        <DiaryPageCards />
      </div>
      <div className="diary-content">
        <p>
          <h1>2024-04-04</h1>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga ullam
          similique non dolores ipsum deserunt. Facilis, optio! Tenetur nisi
          vero quibusdam eum consequuntur placeat culpa quod recusandae
          molestias, ex, ad voluptatum aliquam sapiente ipsum! Eligendi
          consectetur aliquam sit consequuntur, laborum doloribus sapiente
          tempore inventore accusamus. Repellat voluptate at ullam fugiat.
          Libero enim ducimus adipisci eveniet aspernatur perferendis veniam
          aliquid accusamus ipsum, tempora temporibus explicabo repellat. Eaque
          totam explicabo corrupti qui ex expedita quod veniam natus? Assumenda
          eius, repellendus vel ab deleniti corporis accusamus optio ratione
          consectetur possimus voluptatum! Minima iusto eum distinctio amet
          vitae alias maiores repudiandae quisquam, dicta molestias?
        </p>
      </div>
    </div>
  );
}
