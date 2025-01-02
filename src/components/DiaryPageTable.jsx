import { Octokit } from "octokit";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Modal from "react-modal";

Modal.setAppElement("#root");

export function DiaryPageTable() {
  const [pages, setPages] = useState([]);
  const [selectedPageToDelete, setSelectedPageToDelete] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
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
          try {
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
          } catch (error) {
            if (error?.response.status === 404) {
              continue;
            }
          }
        }

        setPages(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const userConfigData = localStorage.getItem("userConfigData");
    if (userConfigData === null) navigate("/config");
  });

  function handleViewPage(path) {
    navigate(`/page/${path}`);
  }

  async function handleDeletePage() {
    setIsModalOpen(false);
    setIsDeleting(true);

    const userConfig = JSON.parse(localStorage.getItem("userConfigData"));

    const octokit = new Octokit({
      auth: userConfig.apiKey,
    });

    try {
      const response = await octokit.request(
        "DELETE /repos/{owner}/{repo}/contents/{path}",
        {
          owner: userConfig.username,
          repo: userConfig.repositoryName,
          path: selectedPageToDelete.name,
          sha: selectedPageToDelete.sha,
          branch: userConfig.branchName,
          message: "delete dairy page",
          committer: {
            name: userConfig.username,
            email: userConfig.email,
          },
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      if (response.status === 200) {
        setIsDeleting(false);
        alert("Deleted!");
      }
    } catch (error) {
      setIsDeleting(false);
      console.error(error);
    }
  }

  function openModal(page) {
    setSelectedPageToDelete(page);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedPageToDelete({});
  }

  function getNumberOfWords(content) {
    const decryptedContent = atob(atob(content));
    return decryptedContent.split(" ").length;
  }

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
        contentLabel="delete-page-modal"
      >
        <h2>Are you sure you want to continue?</h2>
        <div>
          This will delete the diary page. You <strong>WONT</strong> be able to
          restore it!
        </div>
        <div className="modal-buttons">
          <button onClick={handleDeletePage}>Delete</button>
          <button onClick={closeModal}>Close</button>
        </div>
      </Modal>

      {isDeleting ? <span>Deleting...</span> : ""}
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
                  <button
                    onClick={() => handleViewPage(page.name)}
                    type="button"
                  >
                    View
                  </button>
                  <button onClick={() => openModal(page)} type="button">
                    Delete
                  </button>
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
