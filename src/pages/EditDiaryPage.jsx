import { useState } from "react";
import { DiaryContent } from "../components/DiaryContent";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Navbar } from "../components/Navbar";
import UserConfig from "../utils/UserConfig.util";
import { GitHubRepository } from "../model/implementation/GitHubRepository";

export function EditDiaryPagePage() {
  const [page, setPage] = useState(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const { path } = useParams();

  const userConfig = UserConfig.gitHubConfigLocalStorage;

  useEffect(() => {
    async function fetchData() {
      const repository = new GitHubRepository(userConfig);
      try {
        const data = await repository.getDiaryByFilePath(path);
        if (!data) {
          setPage(null);
          setRequestFailed(true);
          return;
        }
        setPage(data);
        setRequestFailed(false);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [
    path,
    userConfig,
    userConfig.apiKey,
    userConfig.branchName,
    userConfig.repositoryName,
    userConfig.username,
  ]);

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
