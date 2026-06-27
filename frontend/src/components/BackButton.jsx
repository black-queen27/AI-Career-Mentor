import { useNavigate } from "react-router-dom";

function BackButton({ to = "/dashboard", label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-outline-secondary mb-3"
      onClick={() => navigate(to)}
    >
      ← {label}
    </button>
  );
}

export default BackButton;