import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { formatDateYYYYMMDD } from "./../utils/format-date.js";
import UserConfig from "../utils/UserConfig.util.js";
import { GitHubRepository } from "../model/implementation/GitHubRepository.js";

DiaryContent.propTypes = {
  todayDiary: PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    sha: PropTypes.string.isRequired,
  }),
  canEdit: PropTypes.bool,
};

export function DiaryContent({ todayDiary, canEdit }) {
  const [diaryContent, setDiaryContent] = useState("");
  const [isTryingToSave, setIsTryingToSave] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const userConfig = UserConfig.gitHubConfigLocalStorage;
  const fileExtension = ".md";

  async function trySaveToGitHub(
    maxAttempts = 5,
    delayPerAttemptInSeconds = 5
  ) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const formattedTodayDate = formatDateYYYYMMDD(
        new Date().toLocaleDateString()
      );

      try {
        const repository = new GitHubRepository(userConfig);
        const latestSha = await repository.getLatestSha(
          formattedTodayDate + fileExtension
        );
        const response = await repository.updateDiary(
          formattedTodayDate + fileExtension,
          latestSha,
          diaryContent
        );

        if (
          (response && response.status === 200) ||
          (response && response.status === 201)
        ) {
          alert("Updated!");
          setIsTryingToSave(false);
          return;
        }

        if (response && response.status === 409) {
          console.warn("Retrying to send updates to GitHub...");
          await new Promise((resolve) =>
            setTimeout(resolve, delayPerAttemptInSeconds * 1000)
          );
        }
      } catch (error) {
        console.error(error);
      }

      attempts++;
    }

    console.warn("Failed to save updates.");
  }

  function handleCachingNewContent() {
    const todayDiaryContent = atob(atob(todayDiary?.content || "")).trim();
    const newContent = diaryContent.trim();

    if (todayDiaryContent !== newContent) {
      localStorage.setItem(todayDiary?.name.split(".")[0], newContent);
    }
  }

  function handleOnChangeDiaryContent(event) {
    setIsEditing(true);
    const { value } = event.target;
    setDiaryContent(value);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    handleCachingNewContent();
    setIsTryingToSave(true);
    await trySaveToGitHub();
    setIsEditing(false);
  }

  useEffect(() => {
    if (isEditing) return;

    const cachedValue = localStorage.getItem(todayDiary?.name.split(".")[0]);
    const todayDiaryContent = atob(atob(todayDiary?.content ?? ""));

    if (cachedValue && todayDiaryContent !== cachedValue) {
      setDiaryContent(cachedValue);
    } else {
      setDiaryContent(todayDiaryContent);
      if (cachedValue) localStorage.removeItem(todayDiary?.name.split(".")[0]);
    }
  }, [todayDiary, isEditing]);

  return (
    <>
      {isTryingToSave ? <span>Saving...</span> : ""}
      <form onSubmit={handleFormSubmit}>
        <textarea
          disabled={isTryingToSave || !canEdit}
          name="diaryContent"
          value={diaryContent}
          onChange={handleOnChangeDiaryContent}
        ></textarea>

        {canEdit && (
          <button disabled={isTryingToSave} type="submit">
            Save changes
          </button>
        )}
      </form>
    </>
  );
}
