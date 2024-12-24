import { Octokit } from "octokit";
import { useEffect } from "react";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { DiaryContent } from "../components/DiaryContent";

export function TodayDiaryPage() {
  const [todayDiary, setTodayDiary] = useState(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString().split("/");
    const formattedTodayDate = `${today[2]}-${today[0]}-${today[1]}`;
    const userConfig = JSON.parse(localStorage.getItem("userConfigData"));

    async function getTodayDiary() {
      const octokit = new Octokit({
        auth: userConfig.apiKey,
      });

      try {
        const response = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
          {
            owner: userConfig.username,
            repo: userConfig.repositoryName,
            path: formattedTodayDate + ".md",
            ref: userConfig.branchName,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        return response.data;
      } catch (error) {
        if (error.response.status === 404) {
          return null;
        }
        console.error(error);
      }
    }

    async function createTodayDiary() {
      const octokit = new Octokit({
        auth: userConfig.apiKey,
      });

      try {
        const response = await octokit.request(
          "PUT /repos/{owner}/{repo}/contents/{path}",
          {
            owner: userConfig.username,
            repo: userConfig.repositoryName,
            path: formattedTodayDate + ".md",
            branch: userConfig.branchName,
            message: "created today's diary",
            committer: {
              name: userConfig.username,
              email: userConfig.email,
            },
            content: btoa(""),
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        return response.data;
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchDiary() {
      let data = await getTodayDiary();
      if (!data) data = await createTodayDiary();
      setTodayDiary(data);
    }

    fetchDiary();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>{todayDiary ? todayDiary.name.split(".")[0] : "Loading..."}</h1>
      <hr />
      <section>
        <DiaryContent todayDiary={todayDiary} canEdit={true} />
      </section>
    </div>
  );
}
