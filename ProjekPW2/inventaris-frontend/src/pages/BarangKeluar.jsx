import { useEffect, useState } from "react";
import api from "../api/axios";

export default function BarangKeluar() {
  const [barang, setBarang] = useState([]);
  const [form, setForm] = useState({
    barang_id: "",
    jumlah: 1,
    tanggal: "",
    tujuan: "",
  });

  useEffect(() => {
    const fetchBarang = async () => {
      const res = await api.get("/barang");
      setBarang(res.data);
    };
    fetchBarang();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/barang-keluar", form);
      alert("Barang keluar berhasil disimpan");
      setForm({ barang_id: "", jumlah: 1, tanggal: "", tujuan: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan");
    }
  };

  return (
    <div>
      <h1 className="page-title">Barang Keluar</h1>

      <div className="card form-card">
        <h3>Input Barang Keluar</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label>Barang</label>
            <select
              name="barang_id"
              value={form.barang_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Barang --</option>
              {barang.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.kode} - {b.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Jumlah</label>
            <input
              type="number"
              name="jumlah"
              value={form.jumlah}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div>
            <label>Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Tujuan</label>
            <input
              name="tujuan"
              value={form.tujuan}
              onChange={handleChange}
            />
          </div>
          <button className="btn-primary" type="submit">
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
}
