import { Trash2 } from "lucide-react";
import { Edit3 } from "lucide-react";
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
        <button className="page-card-action-btn page-card-action-edit-btn">
          <Edit3 size={18} />
          Edit
        </button>
        <button className="page-card-action-btn page-card-action-delete-btn">
          <Trash2 size={18} />
          Delete
        </button>
      </div>
      <div className="page-card-categories"></div>
    </div>
  );
}
