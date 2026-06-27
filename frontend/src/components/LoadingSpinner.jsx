function LoadingSpinner({ text = "Processing..." }) {
  return (
    <div className="text-center py-5">
      <div
        className="spinner-border text-primary"
        role="status"
      >
        <span className="visually-hidden">
          Loading...
        </span>
      </div>

      <p className="mt-3 fw-semibold">
        {text}
      </p>
    </div>
  );
}

export default LoadingSpinner;