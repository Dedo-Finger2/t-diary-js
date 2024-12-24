import { Octokit } from "octokit";
import { useState } from "react";
import { useEffect } from "react";

export function DiaryPageTable() {
  const [pages, setPages] = useState([]);

  function getNumberOfWords(content) {
    const decryptedContent = atob(content);
    return decryptedContent.split(" ").length;
  }

  async function fetchData() {
    const userConfig = JSON.parse(localStorage.getItem("userConfigData"));

    const octokit = new Octokit({
      auth: userConfig.apiKey,
    });

    try {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
        {
          owner: userConfig.username,
          repo: userConfig.repositoryName,
          path: ".",
          ref: userConfig.branchName,
        }
      );

      const data = [];

      for (const page of response.data) {
        const response = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
          {
            owner: userConfig.username,
            repo: userConfig.repositoryName,
            path: page.name,
            ref: userConfig.branchName,
          }
        );

        data.push({
          ...response.data,
          numberOfWords: getNumberOfWords(response.data.content),
        });
      }

      setPages(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {pages && pages.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Number of words</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page, index) => (
              <tr key={index}>
                <td>{page.name.split(".")[0]}</td>
                <td>{page.numberOfWords} words</td>
                <td>W.I.P</td>
                <td>
                  <button type="button">Edit</button>
                  <button type="button">View</button>
                  <button type="button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Title</th>
              <th>Number of words</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}
