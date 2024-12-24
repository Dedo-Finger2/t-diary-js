import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Octokit } from "octokit";
import { useEffect } from "react";

export function ReadDiaryPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchPages() {
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

        let combinedContent = "";

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

          const decodedContent = atob(atob(response.data.content));
          combinedContent += `${page.name}${decodedContent}`;
        }

        setContent(combinedContent);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPages();
  }, []);

  return (
    <>
      <section>
        <Navbar />
        <h1>Reading Diary</h1>
        <hr />
      </section>
      {/* Páginas aqui */}
      <section>
        {/* TODO: Implementar mostrar conteúdo em duas colunas diferentes */}
        <div>
          <button>Previous</button>
          <button>Next</button>
        </div>
        <div className="read-diary-content">{content}</div>
      </section>
    </>
  );
}
