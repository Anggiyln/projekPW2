<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * Menampilkan semua item
     */
    public function index()
    {
        return response()->json(Item::all());
    }

    /**
     * Menambah item baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|max:100|unique:items,kode',
            'nama' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:100',
            'merk' => 'nullable|string|max:100',
            'satuan' => 'nullable|string|max:50',
            'stok' => 'nullable|integer',
            'harga' => 'nullable|numeric',
            'deskripsi' => 'nullable|string',
        ]);

        // pastikan default untuk beberapa field bila tidak diisi
        $validated = array_merge([
            'satuan' => $validated['satuan'] ?? 'pcs',
            'stok' => $validated['stok'] ?? 0,
        ], $validated);

        $item = Item::create(attributes: $validated);

        return response()->json([
            'message' => 'Data item berhasil ditambahkan',
            'data' => $item
        ], 201);
    }

    /**
     * Menampilkan item berdasarkan ID
     */
    public function show($id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($item);
    }

    /**
     * Mengupdate data item
     */
    public function update(Request $request, $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'kode' => "required|string|max:100|unique:items,kode,{$id}",
            'nama' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:100',
            'merk' => 'nullable|string|max:100',
            'satuan' => 'nullable|string|max:50',
            'stok' => 'nullable|integer',
            'harga' => 'nullable|numeric',
            'deskripsi' => 'nullable|string',
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'Data item berhasil diperbarui',
            'data' => $item
        ]);
    }

    /**
     * Menghapus item
     */
    public function destroy($id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Data item berhasil dihapus']);
    }
}
