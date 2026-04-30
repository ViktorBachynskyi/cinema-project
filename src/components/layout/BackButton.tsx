import { useNavigate, useLocation } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button className="back-button" onClick={handleBack}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#fff"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
      >
        <g data-name="Layer 2">
          <g data-name="arrow-ios-back">
            <rect
              width="24"
              height="24"
              transform="rotate(90 12 12)"
              opacity="0"
            />
            <path d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64z" />
          </g>
        </g>
      </svg>
      <span>Back</span>
    </button>
  );
};

export default BackButton;
