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
  const [isTryingToSave, setIsTryingToSave] = useState(false);

  async function trySaveToGitHub(maxAtempts = 5, delayPerAttemptInSeconds = 5) {
    let attempts = 0;

    do {
      const today = new Date().toLocaleDateString().split("/");
      const formatedTodayDate = `${today[2]}-${today[0]}-${today[1]}`;
      const userConfig = JSON.parse(localStorage.getItem("userConfigData"));

      const octokit = new Octokit({
        auth: userConfig.apiKey,
      });

      try {
        // Passo 1: Obter o SHA mais recente
        const getFileResponse = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner: userConfig.username,
            repo: userConfig.repositoryName,
            path: formatedTodayDate + ".md",
            ref: userConfig.branchName,
          },
        );
        const latestSha = getFileResponse.data.sha;

        // Passo 2: Atualizar o arquivo com o SHA mais recente
        const response = await octokit.request(
          "PUT /repos/{owner}/{repo}/contents/{path}",
          {
            owner: userConfig.username,
            repo: userConfig.repositoryName,
            path: formatedTodayDate + ".md",
            branch: userConfig.branchName,
            sha: latestSha, // Use o SHA mais recente
            message: "updates today's diary",
            committer: {
              name: userConfig.username,
              email: userConfig.email,
            },
            content: btoa(btoa(diaryContent)),
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );

        if (response.status === 200 || response.status === 201) {
          alert("Updated!");
          setIsTryingToSave(false);
          return;
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setTimeout(() => {
            console.warn("Retrying to send udpates to GitHub...");
          }, delayPerAttemptInSeconds * 1000); // seconds to miliseconds
        } else {
          console.error(error);
        }
      }
    } while (attempts < maxAtempts);

    console.warn("Failed to save updates.");
  }

  function handleCachingNewContent() {
    const todayDiaryContent = atob(atob(todayDiary?.content || "")).trim();
    const newContent = diaryContent.trim();
    if (todayDiaryContent !== newContent) {
      localStorage.setItem("cachedNewContent", newContent);
    }
  }

  function handleOnChangeDiaryContent(event) {
    const { value } = event.target;
    setDiaryContent(value);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    handleCachingNewContent();
    setIsTryingToSave(true);
    await trySaveToGitHub();
  }

  useEffect(() => {
    const cachedValue = localStorage.getItem("cachedNewContent");
    const todayDiaryContent = atob(atob(todayDiary?.content ?? ""));
    const usingOldCache = !todayDiaryContent.includes(cachedValue);

    if (cachedValue && usingOldCache) {
      setDiaryContent(cachedValue);
    } else {
      setDiaryContent(todayDiaryContent);
      localStorage.removeItem("cachedNewContent");
    }
  }, [todayDiary]);

  return (
    <>
      {isTryingToSave ? <span>Saving...</span> : ""}
      <form onSubmit={handleFormSubmit}>
        <textarea
          disabled={isTryingToSave}
          name="diaryContent"
          value={diaryContent ? diaryContent : "loading..."}
          onChange={handleOnChangeDiaryContent}
        ></textarea>

        <button disabled={isTryingToSave} type="submit">
          Save changes
        </button>
      </form>
    </>
  );
}
