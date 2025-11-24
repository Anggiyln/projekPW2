// App.js (dengan input harga auto-format Rupiah)
// Referensi screenshot: /mnt/data/3e8021e2-e580-49fa-a79b-6783ea62a58d.png

import React, { useEffect, useState } from "react";
import "./index.css"; // pastikan file src/index.css sudah dibuat sesuai instruksi sebelumnya

// BASE_API langsung ke resource items (sesuai permintaan)
const BASE_API = "http://localhost:8000/api/items";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    kode: "",
    nama: "",
    kategori: "",
    merk: "",
    satuan: "pcs",
    stok: 0,
    harga: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(BASE_API); // GET /api/items
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
      else if (Array.isArray(data.data)) setItems(data.data);
      else setItems([]);
    } catch (err) {
      console.error("fetchItems error:", err);
      setItems([]);
      setMessage({ type: "error", text: "Gagal memuat data. Cek backend." });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function resetForm() {
    setForm({ kode: "", nama: "", kategori: "", merk: "", satuan: "pcs", stok: 0, harga: "" });
    setSelected(null);
    setErrors({});
  }

  function startEdit(item) {
    setSelected(item);
    setForm({
      kode: item.kode ?? "",
      nama: item.nama ?? "",
      kategori: item.kategori ?? "",
      merk: item.merk ?? "",
      satuan: item.satuan ?? "pcs",
      stok: item.stok ?? 0,
      harga: item.harga ? formatNumberToInput(item.harga) : "",
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ------------------- RUPIAH helpers -------------------
  // format number (database) to input string like "10.000"
  function formatNumberToInput(number) {
    if (number === null || number === undefined || number === "") return "";
    return Number(number).toLocaleString("id-ID");
  }

  // format for display with Rp prefix
  function formatRupiahDisplay(value) {
    if (value === null || value === undefined || value === "") return "Rp 0";
    const num = Number(String(value).replace(/\D/g, ""));
    return "Rp " + num.toLocaleString("id-ID");
  }

  // format input while typing: keep only digits and add thousand separators
  function formatInputRupiah(value) {
    const numberString = String(value).replace(/\D/g, "");
    if (!numberString) return "";
    return Number(numberString).toLocaleString("id-ID");
  }

  // helper to convert input formatted string to raw number (string of digits)
  function inputToRawNumber(value) {
    return String(value).replace(/\./g, "");
  }

  function handleHargaChange(e) {
    const formatted = formatInputRupiah(e.target.value);
    setForm((prev) => ({ ...prev, harga: formatted }));
  }

  // ------------------- submit (create/update) -------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    // prepare payload: convert harga to raw number string or null
    const payload = {
      ...form,
      harga: form.harga ? inputToRawNumber(form.harga) : null,
    };

    const url = selected ? `${BASE_API}/${selected.id}` : BASE_API;
    const method = selected ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 422) {
        const errData = await res.json();
        setErrors(errData.errors || {});
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        console.error("save failed:", res.status, txt);
        setMessage({ type: "error", text: "Gagal menyimpan data. Cek console/backend." });
        return;
      }

      const data = await res.json();
      const item = data.data ?? data;

      // when server returns harga as number, convert to display input format when setting selected
      if (selected) setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      else setItems((prev) => [item, ...prev]);

      setMessage({ type: "success", text: selected ? "Item berhasil diperbarui." : "Item berhasil ditambahkan." });
      resetForm();
    } catch (err) {
      console.error("handleSubmit error:", err);
      setMessage({ type: "error", text: "Terjadi kesalahan pada server." });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus item ini?")) return;
    try {
      const res = await fetch(`${BASE_API}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setMessage({ type: "error", text: "Gagal menghapus item." });
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      setMessage({ type: "success", text: "Item berhasil dihapus." });
    } catch (err) {
      console.error("delete error:", err);
      setMessage({ type: "error", text: "Error server saat menghapus." });
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: 18 }}>Inventory Barang</h1>

      {message && (
        <div className={`card`} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: message.type === "error" ? "#7a0000" : "#005900" }}>{message.text}</div>
            <button className="btn btn-ghost" onClick={() => setMessage(null)}>×</button>
          </div>
        </div>
      )}

      <div className="grid">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{selected ? "Edit Item" : "Tambah Item"}</h2>
          <form onSubmit={handleSubmit}>
            <label>Kode *</label>
            <input name="kode" value={form.kode} onChange={handleChange} />

            <label>Nama *</label>
            <input name="nama" value={form.nama} onChange={handleChange} />

            <label>Kategori</label>
            <input name="kategori" value={form.kategori} onChange={handleChange} />

            <label>Merk</label>
            <input name="merk" value={form.merk} onChange={handleChange} />

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label>Satuan</label>
                <input name="satuan" value={form.satuan} onChange={handleChange} />
              </div>

              <div style={{ width: 120 }}>
                <label>Stok</label>
                <input type="number" name="stok" value={form.stok} onChange={handleChange} />
              </div>
            </div>

            <label>Harga</label>
            <input name="harga" value={form.harga} onChange={handleHargaChange} placeholder="contoh: 10.000" />

            <div style={{ marginTop: 12 }}>
              <button type="submit" className="btn btn-primary">{selected ? "Update" : "Simpan"}</button>
              {selected && <button type="button" onClick={resetForm} className="btn btn-ghost" style={{ marginLeft: 8 }}>Batal</button>}
            </div>
          </form>
        </div>

        <div className="cardWide card">
          <h2 style={{ marginTop: 0 }}>Daftar Item</h2>

          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p>Tidak ada item.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Merk</th>
                    <th>Satuan</th>
                    <th>Stok</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.kode}</td>
                      <td>{it.nama}</td>
                      <td>{it.kategori}</td>
                      <td>{it.merk}</td>
                      <td>{it.satuan}</td>
                      <td>{it.stok}</td>
                      <td>{formatRupiahDisplay(it.harga)}</td>
                      <td>
                        <button onClick={() => startEdit(it)} className="btn btn-ghost" style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => handleDelete(it.id)} className="btn btn-danger">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button onClick={fetchItems} className="btn btn-ghost">Refresh</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1100, margin: "20px auto", padding: 20 },
};
