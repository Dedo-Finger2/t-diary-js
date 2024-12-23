import { useState } from "react";
import { Octokit } from "octokit";
import { useEffect } from "react";
import PropTypes from "prop-types";

DiaryContent.propTypes = {
  todayDiary: PropTypes.shape({
    content: PropTypes.string.isRequired,
    sha: PropTypes.string.isRequired,
  }),
};

export function DiaryContent({ todayDiary }) {
  const [diaryContent, setDiaryContent] = useState("");

  function handleOnChangeDiaryContent(event) {
    const { value } = event.target;
    setDiaryContent(value);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const today = new Date().toLocaleDateString().split("/");
    const formatedTodayDate = `${today[2]}-${today[0]}-${today[1]}`;
    const userConfig = JSON.parse(localStorage.getItem("userConfigData"));

    const octokit = new Octokit({
      auth: userConfig.apiKey,
    });

    try {
      const response = await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: userConfig.username,
          repo: userConfig.repositoryName,
          path: formatedTodayDate + ".md",
          branch: userConfig.branchName,
          sha: todayDiary.sha,
          message: "updates today's diary",
          committer: {
            name: userConfig.username,
            email: userConfig.email,
          },
          content: btoa(btoa(diaryContent)),
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      if (response.status === 200) alert("Updated!");
    } catch (error) {
      if (error.response.status === 404) {
        return null;
      }
      console.error(error);
    }
  }

  useEffect(() => {
    setDiaryContent(todayDiary?.content ?? "");
  }, [todayDiary]);

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>
          <input type="checkbox" id="reveal-contet" />
          <label htmlFor="reveal-content">Reveal Content</label>
        </div>
        <textarea
          name="diaryContent"
          value={diaryContent ? diaryContent : "loading..."}
          onChange={handleOnChangeDiaryContent}
        ></textarea>

        <button type="submit">Save changes</button>
      </form>
    </>
  );
}
