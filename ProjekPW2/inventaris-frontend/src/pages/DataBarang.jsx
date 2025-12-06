import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = { kode: "", nama: "", kategori: "", stok: 0, lokasi: "" };

export default function DataBarang() {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchBarang = async () => {
    setLoading(true);
    const res = await api.get("/barang");
    setBarang(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const openTambah = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({
      kode: b.kode,
      nama: b.nama,
      kategori: b.kategori || "",
      stok: b.stok || 0,
      lokasi: b.lokasi || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/barang/${editingId}`, form);
      } else {
        await api.post("/barang", form);
      }
      closeModal();
      fetchBarang();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan barang");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus barang ini?")) return;
    try {
      await api.delete(`/barang/${id}`);
      fetchBarang();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus barang");
    }
  };

  return (
    <div>
      <h1 className="page-title">Data Barang</h1>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h3>Daftar Barang</h3>
          {isAdmin && (
            <button className="btn-primary" onClick={openTambah}>
              + Tambah Barang
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Lokasi</th>
                {isAdmin && <th>Aksi</th>}
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
                  {isAdmin && (
                    <td>
                      <button className="btn-link" onClick={() => openEdit(b)}>
                        Edit
                      </button>
                      <button
                        className="btn-link danger"
                        onClick={() => handleDelete(b.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {barang.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center" }}>
                    Belum ada data barang
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editingId ? "Edit Barang" : "Tambah Barang"}
              </div>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div>
                <label>Kode</label>
                <input
                  name="kode"
                  value={form.kode}
                  onChange={handleChange}
                  required
                  disabled={!!editingId}
                />
              </div>
              <div>
                <label>Nama</label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Kategori</label>
                <input
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Stok</label>
                <input
                  type="number"
                  name="stok"
                  value={form.stok}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div>
                <label>Lokasi</label>
                <input
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn-primary">
                {editingId ? "Simpan Perubahan" : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
