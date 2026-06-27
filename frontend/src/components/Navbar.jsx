import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          AI Career Mentor
        </Link>

        <div className="ms-auto d-flex align-items-center gap-3">
          {user ? (
            <>
              {/* Profile Icon */}
              <Link
                to="/profile"
                className="text-white text-decoration-none"
                title="Profile"
              >
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "2rem" }}
                ></i>
              </Link>

              <button
                className="btn btn-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-light btn-sm" to="/login">
                Login
              </Link>

              <Link className="btn btn-outline-light btn-sm" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;