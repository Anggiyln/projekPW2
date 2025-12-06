import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardPetugas from "./pages/DashboardPetugas";
import DataBarang from "./pages/DataBarang";
import BarangMasuk from "./pages/BarangMasuk";
import BarangKeluar from "./pages/BarangKeluar";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import ManajemenUser from "./pages/ManajemenUser";
import NoAccess from "./pages/NoAccess";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Layout>
                  <DashboardAdmin />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/gudang"
            element={
              <ProtectedRoute roles={["petugas", "admin"]}>
                <Layout>
                  <DashboardPetugas />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/barang"
            element={
              <ProtectedRoute roles={["petugas", "admin"]}>
                <Layout>
                  <DataBarang />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/barang-masuk"
            element={
              <ProtectedRoute roles={["petugas", "admin"]}>
                <Layout>
                  <BarangMasuk />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/barang-keluar"
            element={
              <ProtectedRoute roles={["petugas", "admin"]}>
                <Layout>
                  <BarangKeluar />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/riwayat"
            element={
              <ProtectedRoute roles={["petugas", "admin"]}>
                <Layout>
                  <RiwayatTransaksi />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Layout>
                  <ManajemenUser />
                </Layout>
              </ProtectedRoute>
            }
          />


          <Route
            path="/no-access"
            element={
              <Layout>
                <NoAccess />
              </Layout>
            }
          />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
