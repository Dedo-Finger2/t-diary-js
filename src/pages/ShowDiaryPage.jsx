import { useState } from "react";
import { DiaryContent } from "../components/DiaryContent";
import { Octokit } from "octokit";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Navbar } from "../components/Navbar";

export function ShowDiaryPagePage() {
  const [page, setPage] = useState(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const { path } = useParams();

  const diaryDateObject = new Date(path.split(".md")[0]);
  const redirect = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const userConfig = JSON.parse(localStorage.getItem("userConfigData"));
      const octokit = new Octokit({
        auth: userConfig.apiKey,
      });
      try {
        const response = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
          {
            owner: userConfig.username,
            repo: userConfig.repositoryName,
            path,
            ref: userConfig.branchName,
          }
        );
        setPage(response.data);
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
  }, [path]);

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
    <>
      <Navbar />
      <div>
        <h1>
          {requestFailed
            ? "Page Not Found!"
            : page?.name.split(".")[0] || "Loading..."}
        </h1>
        <hr />
        <div>
          <button onClick={handlePreviousDiary}>Previous</button>
          <button onClick={handleNextDiary}>Next</button>
        </div>
        <DiaryContent todayDiary={page} canEdit={false} />
      </div>
    </>
  );
}
