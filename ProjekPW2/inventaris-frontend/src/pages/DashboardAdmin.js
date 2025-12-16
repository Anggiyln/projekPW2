import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DashboardAdmin() {
  const [barang, setBarang] = useState([]);
  const [riwayatMasuk, setRiwayatMasuk] = useState([]);
  const [riwayatKeluar, setRiwayatKeluar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [resBarang, resMasuk, resKeluar] = await Promise.all([
        api.get("/barang"),
        api.get("/riwayat-masuk"),
        api.get("/riwayat-keluar"),
      ]);
      setBarang(resBarang.data);
      setRiwayatMasuk(resMasuk.data);
      setRiwayatKeluar(resKeluar.data);
      setLoading(false);
    };
    load();
  }, []);

  const totalJenis = barang.length;
  const totalStok = barang.reduce((s, b) => s + (b.stok || 0), 0);
  const stokMenipis = barang.filter((b) => (b.stok || 0) <= 5);
  const totalMasuk = riwayatMasuk.reduce((s, t) => s + (t.jumlah || 0), 0);
  const totalKeluar = riwayatKeluar.reduce((s, t) => s + (t.jumlah || 0), 0);

  const recentMasuk = riwayatMasuk.slice(0, 5);
  const recentKeluar = riwayatKeluar.slice(0, 5);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="page-title">Dashboard Admin</h1>

      {/* kartu ringkasan */}
      <div className="card-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Jenis Barang</div>
          <div className="stat-value">{totalJenis}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total Stok</div>
          <div className="stat-value">{totalStok}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total Masuk</div>
          <div className="stat-value">{totalMasuk}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total Keluar</div>
          <div className="stat-value">{totalKeluar}</div>
        </div>
      </div>

      {/* Stok menipis */}
      <div className="card">
        <h3>Barang dengan Stok Menipis (≤ 5)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            {stokMenipis.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Tidak ada stok menipis
                </td>
              </tr>
            )}
            {stokMenipis.map((b) => (
              <tr key={b.id}>
                <td>{b.kode}</td>
                <td>{b.nama}</td>
                <td>{b.kategori}</td>
                <td>{b.stok}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* dua kolom: riwayat masuk & keluar */}
      <div className="card-grid">
        <div className="card">
          <h3>Riwayat Barang Masuk (Terbaru)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Tgl</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {recentMasuk.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Belum ada data
                  </td>
                </tr>
              )}
              {recentMasuk.map((t) => (
                <tr key={t.id}>
                  <td>{t.tanggal}</td>
                  <td>{t.barang?.nama}</td>
                  <td>{t.jumlah}</td>
                  <td>{t.user?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Riwayat Barang Keluar (Terbaru)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Tgl</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {recentKeluar.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Belum ada data
                  </td>
                </tr>
              )}
              {recentKeluar.map((t) => (
                <tr key={t.id}>
                  <td>{t.tanggal}</td>
                  <td>{t.barang?.nama}</td>
                  <td>{t.jumlah}</td>
                  <td>{t.user?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
