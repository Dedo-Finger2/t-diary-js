import { Octokit } from "octokit";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Modal from "react-modal";
import UserConfig from "../utils/UserConfig.util";

Modal.setAppElement("#root");

export function DiaryPageTable() {
  const [pages, setPages] = useState([]);
  const [paginatedPages, setPaginatedPages] = useState([]);
  const [paginatedPagesBackup, setPaginatedPagesBackup] = useState([]);
  const [selectedPageToDelete, setSelectedPageToDelete] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [amountOfPages, setAmountOfPages] = useState(0);

  const navigate = useNavigate();
  const currentPage = Number(searchParams.get("currentPage") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 10);
  const userConfig = UserConfig.gitHubConfigLocalStorage;

  useEffect(() => {
    async function fetchData() {
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
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = pages.slice(startIndex, endIndex);
    setPaginatedPages(paginatedData);
    setPaginatedPagesBackup(paginatedData);
    setAmountOfPages(Math.ceil(paginatedData.length / perPage));
  }, [currentPage, pages, perPage]);

  useEffect(() => {
    if (userConfig === null) navigate("/config");
  });

  function handleNextPage() {
    if (currentPage === amountOfPages) return;
    navigate(`/pages?currentPage=${currentPage + 1}`);
  }

  function handlePreviousPage() {
    if (currentPage === 1) return;
    navigate(`/pages?currentPage=${currentPage - 1}`);
  }

  function handleViewPage(path) {
    navigate(`/page/${path}`);
  }

  function handleEditPage(path) {
    navigate(`/page/${path}/edit`);
  }

  async function handleDeletePage() {
    setIsModalOpen(false);
    setIsDeleting(true);

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

  function handleSearch(e) {
    const value = e.target.value;

    if (value.length > 0) {
      const filteredPages = paginatedPagesBackup.filter((page) => {
        if (page.name.split(".")[0].includes(value.toLowerCase())) {
          return page;
        }
      });
      setPaginatedPages(filteredPages);
    } else {
      setPaginatedPages(paginatedPagesBackup);
    }
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
        <div>
          <input type="text" onChange={handleSearch} placeholder="Search..." />
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
              {paginatedPages.map((page, index) => (
                <tr key={index}>
                  <td>{page.name.split(".")[0]}</td>
                  <td>{page.numberOfWords} words</td>
                  <td>W.I.P</td>
                  <td>
                    <button
                      onClick={() => handleEditPage(page.name)}
                      type="button"
                    >
                      Edit
                    </button>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button onClick={handlePreviousPage}>Previous</button>
              <p>
                Page {currentPage} of {amountOfPages}
              </p>
              <button onClick={handleNextPage}>Next</button>
            </div>
            <div>
              <span>Showing {perPage} pages</span>
            </div>
          </div>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}
