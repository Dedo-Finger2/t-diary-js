import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Octokit } from "octokit";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "react-query";
import { useRef } from "react";

export function ReadDiaryPage() {
  const navigate = useNavigate();
  const userConfigData = JSON.parse(localStorage.getItem("userConfigData"));
  const params = useParams();
  const currentPage = Number(params.page ?? 1) - 1;

  const diaryContentRef = useRef(null);
  const dynamicContent = useRef([]);
  const { data, error, isLoading } = useQuery("diariesData", fetchData);
  const [twoColumnSize, setTwoColumnSize] = useState(true);
  const [cachedContent, setCachedContent] = useState(null);

  useEffect(() => {
    const localCache = localStorage.getItem("dynamicContent");
    if (localCache) {
      setCachedContent(JSON.parse(localCache));
    } else if (
      !isLoading &&
      data &&
      dynamicContent.current.length === 0 &&
      !localCache
    ) {
      const offscreenDiv = document.createElement("div");
      offscreenDiv.style.position = "absolute";
      offscreenDiv.style.visibility = "hidden";
      offscreenDiv.style.width = diaryContentRef.current.offsetWidth + "px";
      offscreenDiv.style.columnCount = 2;
      document.body.appendChild(offscreenDiv);

      let content = "";
      const pages = [];
      const dataChars = data.split("");

      for (const char of dataChars) {
        content += char;
        offscreenDiv.innerText = content;

        if (offscreenDiv.scrollHeight > window.innerHeight) {
          pages.push(content);
          content = "";
          offscreenDiv.innerText = "";
        }
      }

      pages.push(content);
      dynamicContent.current = pages;
      setCachedContent(pages); // Atualiza o estado com o novo conteúdo
      localStorage.setItem("dynamicContent", JSON.stringify(pages)); // Cache o conteúdo
      document.body.removeChild(offscreenDiv);
    }
  }, [data, isLoading]);

  useEffect(() => {
    function handleResize(e) {
      if (e.target.innerWidth <= 900) setTwoColumnSize(false);
      else setTwoColumnSize(true);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!userConfigData) {
      navigate("/config");
    }
  }, [navigate, userConfigData]);

  function handleNextPage() {
    if (cachedContent && cachedContent.length === currentPage + 1) return;
    navigate(`/read/${currentPage + 2}`);
  }

  function handlePreviousPage() {
    if (currentPage === 0) return;
    navigate(`/read/${currentPage + 1 - 1}`);
  }

  async function fetchData() {
    try {
      let combinedContent = "";

      const octokit = new Octokit({
        auth: userConfigData.apiKey,
      });

      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
        {
          owner: userConfigData.username,
          repo: userConfigData.repositoryName,
          path: ".",
          ref: userConfigData.branchName,
        }
      );

      if (response.data) {
        for (const page of response.data) {
          const response = await octokit.request(
            "GET /repos/{owner}/{repo}/contents/{path}?ref={ref}",
            {
              owner: userConfigData.username,
              repo: userConfigData.repositoryName,
              path: page.name,
              ref: userConfigData.branchName,
            }
          );

          if (response.status === 200) {
            const content =
              "<h1 className='diary-title'>" +
              response.data.name.split(".")[0] +
              "</h1>" +
              "<br />" +
              atob(atob(response.data.content)).replaceAll("\n", "<br />");
            combinedContent += content;
          }
        }
      }

      return combinedContent;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <section>
        <Navbar />
        <h1>Reading Diary</h1>
        <hr />
        {isLoading ? (
          "Loading..."
        ) : (
          <div>
            <div>
              <button onClick={handlePreviousPage}>Previous</button>
              <button onClick={handleNextPage}>Next</button>
            </div>
            <div
              ref={diaryContentRef}
              id="diary-content"
              style={{
                columnCount: twoColumnSize ? 2 : 1,
              }}
              dangerouslySetInnerHTML={{
                __html:
                  cachedContent?.length > 0
                    ? cachedContent[currentPage] ??
                      "<h2>404 Page not found!</h1>"
                    : "Loading...",
              }}
            ></div>
          </div>
        )}
      </section>
    </>
  );
}
