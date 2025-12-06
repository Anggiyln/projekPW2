import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "menu-item active" : "menu-item";

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // kalau kamu buat endpoint logout
    } catch (e) {}
    logout();
    navigate("/login");
  };

  const role = user?.role;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-dot" />
          <div>
            <div className="app-title">Inventaris</div>
            <div className="app-subtitle">Sistem Inventaris Barang</div>
          </div>
        </div>

        <div className="user-box">
          <div className="avatar-circle">{user?.name?.charAt(0)}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>

        <nav className="menu">
          {role === "admin" && (
            <Link className={isActive("/admin")} to="/admin">
              Dashboard
            </Link>
          )}
          {role === "petugas" && (
            <Link className={isActive("/gudang")} to="/gudang">
              Dashboard
            </Link>
          )}
          <Link className={isActive("/barang")} to="/barang">
            Data Barang
          </Link>
          <Link className={isActive("/barang-masuk")} to="/barang-masuk">
            Barang Masuk
          </Link>
          <Link className={isActive("/barang-keluar")} to="/barang-keluar">
            Barang Keluar
          </Link>
          <Link className={isActive("/riwayat")} to="/riwayat">
            Riwayat Transaksi
        </Link>
        {role === "admin" && (
            <Link className={isActive("/users")} to="/users">
                Manajemen User
            </Link>
        )}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-title">Dashboard</div>
          <div className="topbar-right">
            <span className="topbar-user">{user?.name}</span>
            <button className="btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>
    </div>
  );
}
