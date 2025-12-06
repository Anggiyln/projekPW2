<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    public function index()
    {
        return Barang::orderBy('nama')->get();
    }

    public function store(Request $request)
    {
        // cek role admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Hanya admin yang boleh tambah barang'], 403);
        }

        $data = $request->validate([
            'kode' => 'required|unique:barangs,kode',
            'nama' => 'required',
            'kategori' => 'nullable',
            'stok' => 'nullable|integer',
            'lokasi' => 'nullable'
        ]);

        return Barang::create($data);
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Hanya admin yang boleh edit barang'], 403);
        }

        $barang = Barang::findOrFail($id);
        $barang->update($request->all());
        return $barang;
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Hanya admin yang boleh hapus barang'], 403);
        }

        Barang::findOrFail($id)->delete();

        return response()->json(['message' => 'Barang dihapus']);
    }
}
