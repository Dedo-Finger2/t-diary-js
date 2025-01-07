import React, { useState } from "react";
import { Suspense } from "react";
import { Sidebar } from "../components/Sidebar.jsx";
import { DiaryPageCards } from "../components/DiaryPagesCards.jsx";

export function ConfigPage() {
  const [PlataformConfig, setPlataformConfig] = useState(null);

  function handleSelectPlataform(event) {
    const plataform = event.target.value;
    if (plataform === "Select a plataform...") return;
    switch (plataform.toLowerCase()) {
      case "github":
        setPlataformConfig(
          React.lazy(() => import("./../components/GitHubConfigForm"))
        );
        break;
      case "gitlab":
        setPlataformConfig(null);
        break;
      default:
        setPlataformConfig(null);
    }
  }

  return (
    <div className="main-container">
      <Sidebar />
      <div className="middle-container">
        <DiaryPageCards />
      </div>
      <div className="right-side-container">
        <h1>Config</h1>
        <select
          name="plataform"
          onChange={handleSelectPlataform}
          id="config-plataform-select"
        >
          <option value="#">Select a plataform...</option>
          <option value="github">GitHub</option>
          <option value="gitlab">GitLab</option>
        </select>

        <section>
          <Suspense fallback={<div>Loading...</div>}>
            {PlataformConfig ? <PlataformConfig /> : "Select a plafaform..."}
          </Suspense>
        </section>
      </div>
    </div>
  );
}
