class UserConfig {
  static saveGitHubConfigLocalStorage({
    apiKey,
    username,
    email,
    repositoryName,
    branchName,
  }) {
    const userConfigObj = {
      apiKey: UserConfig.#cryptUserApiKey(apiKey),
      username,
      email,
      repositoryName,
      branchName,
    };
    localStorage.setItem("userConfigData", JSON.stringify(userConfigObj));
  }

  static get gitHubConfigLocalStorage() {
    const userConfig = JSON.parse(localStorage.getItem("userConfigData"));
    userConfig.apiKey = UserConfig.#decryptUserApiKey(userConfig.apiKey);
    return userConfig;
  }

  static #cryptUserApiKey(apiKey) {
    return btoa(apiKey);
  }

  static #decryptUserApiKey(apiKey) {
    return atob(apiKey);
  }
}

export default UserConfig;
