import { useEffect } from "react";
import { useState } from "react";
import UserConfig from "../utils/UserConfig.util";

export default function GitHubConfigForm() {
  const [userConfig, setUserConfig] = useState({
    apiKey: "",
    username: "",
    email: "",
    repositoryName: "",
    branchName: "",
  });

  function handleChangeInputValue(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setUserConfig((previousConfig) => ({
      ...previousConfig,
      [name]: value,
    }));
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    UserConfig.saveGitHubConfigLocalStorage(userConfig);
    alert("Config saved!");
  }

  useEffect(() => {
    const savedUserConfig = localStorage.getItem("userConfigData");
    if (savedUserConfig) setUserConfig(JSON.parse(savedUserConfig));
  }, []);

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="api-key">API Key</label>
          <input
            onChange={handleChangeInputValue}
            name="apiKey"
            value={userConfig.apiKey}
            type="text"
            placeholder="API Key..."
            id="api-key"
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            onChange={handleChangeInputValue}
            name="username"
            value={userConfig.username}
            type="text"
            placeholder="Unsername..."
            id="username"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChangeInputValue}
            name="email"
            value={userConfig.email}
            type="email"
            placeholder="Email..."
            id="email"
          />
        </div>
        <div>
          <label htmlFor="repository-name">Repository Name</label>
          <input
            onChange={handleChangeInputValue}
            name="repositoryName"
            value={userConfig.repositoryName}
            type="text"
            placeholder="Repository Name..."
            id="repository-name"
          />
        </div>
        <div>
          <label htmlFor="branch-name">Branch Name</label>
          <input
            onChange={handleChangeInputValue}
            name="branchName"
            value={userConfig.branchName}
            type="text"
            placeholder="Branch Name..."
            id="branch-name"
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </>
  );
}
