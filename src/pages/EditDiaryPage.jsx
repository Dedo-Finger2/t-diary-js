import { useState } from "react";
import { DiaryContent } from "../components/DiaryContent";
import { Octokit } from "octokit";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Navbar } from "../components/Navbar";

export function EditDiaryPagePage() {
  const [page, setPage] = useState(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const { path } = useParams();

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
        <DiaryContent todayDiary={page} canEdit={true} />
      </div>
    </>
  );
}
