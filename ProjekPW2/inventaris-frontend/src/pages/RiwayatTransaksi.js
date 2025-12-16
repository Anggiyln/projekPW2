import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RiwayatTransaksi() {
  const [masuk, setMasuk] = useState([]);
  const [keluar, setKeluar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [resMasuk, resKeluar] = await Promise.all([
        api.get("/riwayat-masuk"),
        api.get("/riwayat-keluar"),
      ]);
      setMasuk(resMasuk.data);
      setKeluar(resKeluar.data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="page-title">Riwayat Transaksi</h1>

      <div className="card">
        <h3>Barang Masuk</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Barang</th>
              <th>Jumlah</th>
              <th>User</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {masuk.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Belum ada data
                </td>
              </tr>
            )}
            {masuk.map((t) => (
              <tr key={t.id}>
                <td>{t.tanggal}</td>
                <td>{t.barang?.nama}</td>
                <td>{t.jumlah}</td>
                <td>{t.user?.name}</td>
                <td>{t.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Barang Keluar</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Barang</th>
              <th>Jumlah</th>
              <th>User</th>
              <th>Tujuan</th>
            </tr>
          </thead>
          <tbody>
            {keluar.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Belum ada data
                </td>
              </tr>
            )}
            {keluar.map((t) => (
              <tr key={t.id}>
                <td>{t.tanggal}</td>
                <td>{t.barang?.nama}</td>
                <td>{t.jumlah}</td>
                <td>{t.user?.name}</td>
                <td>{t.tujuan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
