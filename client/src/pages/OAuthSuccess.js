import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5050";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const run = async () => {
      try {
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // ✅ store token first
        localStorage.setItem("token", token);

        // ✅ get user details using token
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Failed to load user");

        // ✅ store user + update context
        localStorage.setItem("user", JSON.stringify(data.user));
        login({ ...data.user, token });

        // ✅ redirect based on role
        if (data.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (e) {
        console.error("OAuthSuccess error:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [token, navigate, login]);

  return (
    <div style={{ padding: 40 }}>
      <h3>Signing you in…</h3>
      <p>Please wait.</p>
    </div>
  );
}