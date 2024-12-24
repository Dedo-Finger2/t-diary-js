import { useState, useEffect, useRef } from "react";
import { Octokit } from "octokit";
import { Navbar } from "../components/Navbar";

export function ReadDiaryPage() {
  const [pages, setPages] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);

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
          combinedContent += `<h2>${
            page.name.split(".")[0]
          }</h2><br />${decodedContent}`;
          const processedContent = combinedContent.replaceAll("\n", "<br />");

          paginateContent(processedContent);
        }
      } catch (error) {
        console.error(error);
      }
    }

    function paginateContent(content) {
      const container = containerRef.current;

      // Configurações do Canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const computedStyle = getComputedStyle(container);
      context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;

      // Dimensões do container
      const columnWidth = container.offsetWidth / 2; // Largura de uma coluna
      const maxHeight = container.offsetHeight; // Altura máxima do container
      const lineHeight = parseFloat(computedStyle.lineHeight);

      // Quantidade de linhas por coluna
      const linesPerColumn = Math.floor(maxHeight / lineHeight);
      const maxLinesPerPage = linesPerColumn * 2; // Duas colunas

      let currentPageContent = "";
      let currentLines = 0;
      let currentPageIndex = 0;
      const pagesMap = new Map();

      const words = content.split(" ");
      let currentLine = "";

      for (let word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const textWidth = context.measureText(testLine).width;

        if (textWidth > columnWidth) {
          // Adiciona a linha atual ao conteúdo da página
          currentPageContent += currentLine + "\n";
          currentLines++;
          currentLine = word; // Começa uma nova linha
        } else {
          currentLine = testLine;
        }

        // Verifica se a página está cheia
        if (currentLines >= maxLinesPerPage) {
          pagesMap.set(currentPageIndex, currentPageContent.trim());
          currentPageIndex++;
          currentPageContent = "";
          currentLines = 0;
        }
      }

      // Adiciona a última linha e página
      if (currentLine) {
        currentPageContent += currentLine;
      }
      if (currentPageContent) {
        pagesMap.set(currentPageIndex, currentPageContent.trim());
      }

      setPages(pagesMap);
    }

    fetchPages();
  }, []);

  function goToPreviousPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }

  function goToNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, pages.size - 1));
  }

  return (
    <>
      <section>
        <Navbar />
        <h1>Reading Diary</h1>
        <hr />
      </section>
      {pages.size > 0 ? "" : <span>Loading...</span>}
      <section>
        <div
          ref={containerRef}
          style={{
            height: "80vh",
            columnCount: 2,
            columnGap: "8rem",
            overflow: "hidden",
            padding: "1rem",
          }}
          dangerouslySetInnerHTML={{
            __html: pages.get(currentPage),
          }}
        ></div>
        <div>
          <button onClick={goToPreviousPage} disabled={currentPage === 0}>
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === pages.size - 1}
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}
