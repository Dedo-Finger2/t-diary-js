import { Octokit } from "octokit";
import { Repository } from "../Repository";
import { formatDateYYYYMMDD } from "../../utils/format-date";
import { getNumberOfWords } from "./../../utils/get-number-of-words-in-content";

export class GitHubRepository extends Repository {
  #octokit;
  #userConfig;

  constructor(userConfig) {
    super();
    this.#userConfig = userConfig;
    this.#octokit = new Octokit({
      auth: this.#userConfig.apiKey,
    });
  }

  async deleteDiary(path, sha) {
    const response = await this.#octokit.request(
      "DELETE /repos/{owner}/{repo}/contents/{path}",
      {
        owner: this.#userConfig.username,
        repo: this.#userConfig.repositoryName,
        path,
        sha,
        branch: this.#userConfig.branchName,
        message: "delete dairy page",
        committer: {
          name: this.#userConfig.username,
          email: this.#userConfig.email,
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return response;
  }

  async getAllDiaries() {
    try {
      const response = await this.#octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
        {
          owner: this.#userConfig.username,
          repo: this.#userConfig.repositoryName,
          path: ".",
          ref: this.#userConfig.branchName,
        }
      );

      const data = [];

      for (const page of response.data) {
        try {
          const response = await this.#octokit.request(
            "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
            {
              owner: this.#userConfig.username,
              repo: this.#userConfig.repositoryName,
              path: page.name,
              ref: this.#userConfig.branchName,
            }
          );

          data.push({
            ...response.data,
            numberOfWords: getNumberOfWords(response.data.content),
          });
        } catch (error) {
          if (error?.response.status === 404) {
            continue;
          }
        }
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getLatestSha(filePath) {
    try {
      const getFileResponse = await this.#octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: this.#userConfig.username,
          repo: this.#userConfig.repositoryName,
          path: filePath,
          ref: this.#userConfig.branchName,
        }
      );
      return getFileResponse.data.sha;
    } catch (error) {
      console.error(error);
    }
  }

  async getDiaryByFilePath(filePath) {
    try {
      const response = await this.#octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
        {
          owner: this.#userConfig.username,
          repo: this.#userConfig.repositoryName,
          path: filePath,
          ref: this.#userConfig.branchName,
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

  async createTodayDiary() {
    const fileExtension = ".md";
    const formattedTodayDate = formatDateYYYYMMDD(
      new Date().toLocaleDateString()
    );
    try {
      await this.#octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner: this.#userConfig.username,
        repo: this.#userConfig.repositoryName,
        path: formattedTodayDate + fileExtension,
        branch: this.#userConfig.branchName,
        message: "created today's diary",
        committer: {
          name: this.#userConfig.username,
          email: this.#userConfig.email,
        },
        content: btoa(""),
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async updateDiary(filePath, sha, newContent) {
    try {
      const response = await this.#octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: this.#userConfig.username,
          repo: this.#userConfig.repositoryName,
          path: filePath,
          branch: this.#userConfig.branchName,
          sha,
          message: "updates today's diary",
          committer: {
            name: this.#userConfig.username,
            email: this.#userConfig.email,
          },
          content: btoa(btoa(newContent)),
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      return response;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return error.response;
      }
      console.error(error);
    }
  }

  async getTodayDiary() {
    const fileExtension = ".md";
    const formattedTodayDate = formatDateYYYYMMDD(
      new Date().toLocaleDateString()
    );
    try {
      const response = await this.#octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
        {
          owner: this.#userConfig.username,
          repo: this.#userConfig.repositoryName,
          path: formattedTodayDate + fileExtension,
          ref: this.#userConfig.branchName,
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
}
