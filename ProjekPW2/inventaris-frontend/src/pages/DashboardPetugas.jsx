import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DashboardPetugas() {
  const [barang, setBarang] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/barang");
      setBarang(res.data);
    };
    fetchData();
  }, []);

  const totalBarang = barang.length;
  const totalStok = barang.reduce((sum, b) => sum + (b.stok || 0), 0);

  return (
    <div>
      <h1 className="page-title">Dashboard Petugas Gudang</h1>

      <div className="card-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Jenis Barang</div>
          <div className="stat-value">{totalBarang}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total Stok</div>
          <div className="stat-value">{totalStok}</div>
        </div>
      </div>

      <div className="card">
        <h3>Daftar Barang</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Lokasi</th>
            </tr>
          </thead>
          <tbody>
            {barang.map((b) => (
              <tr key={b.id}>
                <td>{b.kode}</td>
                <td>{b.nama}</td>
                <td>{b.kategori}</td>
                <td>{b.stok}</td>
                <td>{b.lokasi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
