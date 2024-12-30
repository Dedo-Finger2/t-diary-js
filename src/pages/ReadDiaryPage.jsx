import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Octokit } from "octokit";
import { useNavigate } from "react-router";
import { useQuery } from "react-query";

export function ReadDiaryPage() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery("diariesData", fetchData);

  const userConfigData = JSON.parse(localStorage.getItem("userConfigData"));

  useEffect(() => {
    if (!userConfigData) {
      navigate("/config");
    }
  }, [navigate, userConfigData]);

  async function fetchData() {
    try {
      const pages = [];

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
              "<span className='diary-title'>" +
              response.data.name.split(".")[0] +
              "</span>" +
              "<br />" +
              atob(atob(response.data.content)).replaceAll("\n", "<br />");
            pages.push(content);
          }
        }
      }

      return pages;
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
        {isLoading ? "Loading..." : console.log(data)}
      </section>
    </>
  );
}
