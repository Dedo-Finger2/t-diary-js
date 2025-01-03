import { useEffect } from "react";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { DiaryContent } from "../components/DiaryContent";
import { useNavigate } from "react-router";
import UserConfig from "../utils/UserConfig.util.js";
import { GitHubRepository } from "../model/implementation/GitHubRepository.js";

export function TodayDiaryPage() {
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
