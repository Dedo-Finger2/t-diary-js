import { useState } from "react";
import { DiaryContent } from "../components/DiaryContent";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { DiaryPageCards } from "../components/DiaryPagesCards";
import { Sidebar } from "../components/Sidebar";
import UserConfig from "../utils/UserConfig.util";
import { GitHubRepository } from "../model/implementation/GitHubRepository";
import { StepBack } from "lucide-react";
import { StepForward } from "lucide-react";

export function ShowDiaryPagePage() {
  const [page, setPage] = useState(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const { path } = useParams();

  const diaryDateObject = new Date(path.split(".md")[0]);
  const redirect = useNavigate();
  const userConfig = UserConfig.gitHubConfigLocalStorage;

  useEffect(() => {
    async function fetchData() {
      try {
        const repository = new GitHubRepository(userConfig);
        const response = await repository.getDiaryByFilePath(path);
        setPage(response);
        setRequestFailed(false);
      } catch (error) {
        if (error.response.status === 404) {
          setPage(null);
          setRequestFailed(true);
        }
        console.error(error);
      }
    }

    fetchData();
  }, [path, userConfig]);

  function handleNextDiary() {
    const nextFileDate = diaryDateObject;
    nextFileDate.setDate(nextFileDate.getDate() + 1);
    const nextDiaryPath = nextFileDate.toISOString().split("T")[0] + ".md";
    redirect(`/page/${nextDiaryPath}`);
  }

  function handlePreviousDiary() {
    const previousFileDate = diaryDateObject;
    previousFileDate.setDate(previousFileDate.getDate() - 1);
    const previousDiaryPath =
      previousFileDate.toISOString().split("T")[0] + ".md";
    redirect(`/page/${previousDiaryPath}`);
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="middle-container">
        <DiaryPageCards />
      </div>
      <div className="right-side-container">
        <h1>
          {requestFailed
            ? "Page Not Found!"
            : page?.name.split(".")[0] || "Loading..."}
        </h1>
        <DiaryContent todayDiary={page} canEdit={false} />
        <div className="show-diary-control-btn-container">
          <button onClick={handlePreviousDiary}>
            <StepBack />
            Previous
          </button>
          <button onClick={handleNextDiary}>
            <StepForward />
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
