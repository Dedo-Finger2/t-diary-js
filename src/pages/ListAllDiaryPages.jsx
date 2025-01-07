import { DiaryPageCards } from "../components/DiaryPagesCards";
import { Sidebar } from "../components/Sidebar";
import { useEffect } from "react";
import { useState } from "react";
import { DiaryContent } from "../components/DiaryContent";
import { useNavigate } from "react-router";
import UserConfig from "../utils/UserConfig.util.js";
import { GitHubRepository } from "../model/implementation/GitHubRepository.js";

export function ListAllDiaryPagesPage() {
  const [todayDiary, setTodayDiary] = useState(null);

  const navigate = useNavigate();
  const userConfig = UserConfig.gitHubConfigLocalStorage;

  useEffect(() => {
    if (userConfig === null) navigate("/config");
  });

  useEffect(() => {
    async function fetchDiary() {
      const repository = new GitHubRepository(userConfig);
      let data = await repository.getTodayDiary();
      if (data === null) await repository.createTodayDiary();
      data = await repository.getTodayDiary();
      setTodayDiary(data);
    }

    fetchDiary();
  }, [userConfig]);

  return (
    <div className="main-container">
      <Sidebar />
      <div className="middle-container">
        <DiaryPageCards />
      </div>
      <div className="right-side-container">
        <h1>{todayDiary ? todayDiary.name.split(".")[0] : "Loading..."}</h1>
        <DiaryContent todayDiary={todayDiary} canEdit={true} />
      </div>
    </div>
  );
}
