import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/register", form);

      // langsung login setelah register
      login(res.data.user, res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/gudang");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        "Registrasi gagal";
      setError(msg);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Registrasi Akun</h2>
        {error && <div className="alert-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Nama</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Konfirmasi Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>
            DAFTAR
          </button>
        </form>

        <div className="login-footnote">
          Sudah punya akun? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
