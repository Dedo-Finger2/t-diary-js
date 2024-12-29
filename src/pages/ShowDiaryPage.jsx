import { useState } from "react";
import { DiaryContent } from "../components/DiaryContent";
import { Octokit } from "octokit";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Navbar } from "../components/Navbar";

export function ShowDiaryPagePage() {
  const [page, setPage] = useState();
  const { path } = useParams();

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
        },
      );

      setPage(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <h1>{page?.name || "loading..."}</h1>
      <hr />
      <DiaryContent todayDiary={page} canEdit={false} />
    </>
  );
}
