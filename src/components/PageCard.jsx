import PropTypes from "prop-types";

PageCard.propTypes = {
  page: PropTypes.object.isRequired,
};

export function PageCard({ page }) {
  return (
    <div className="page-card">
      <span className="page-card-title">{page.name}</span>
      <span className="page-card-content">{page.name}</span>
      <div className="page-card-actions">
        <button>Edit</button>
        <button>Delete</button>
      </div>
      <div className="page-card-categories"></div>
    </div>
  );
}
