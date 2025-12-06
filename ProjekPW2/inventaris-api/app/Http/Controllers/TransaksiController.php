<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;

class TransaksiController extends Controller
{
    public function masuk(Request $request)
    {
        $data = $request->validate([
            'barang_id' => 'required',
            'jumlah' => 'required|integer|min:1',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable'
        ]);

        $data['user_id'] = auth()->id();

        $trans = BarangMasuk::create($data);

        // update stok
        $barang = Barang::find($data['barang_id']);
        $barang->stok += $data['jumlah'];
        $barang->save();

        return $trans->load('barang', 'user');
    }

    public function keluar(Request $request)
    {
        $data = $request->validate([
            'barang_id' => 'required',
            'jumlah' => 'required|integer|min:1',
            'tanggal' => 'required|date',
            'tujuan' => 'nullable'
        ]);

        $data['user_id'] = auth()->id();

        $barang = Barang::find($data['barang_id']);

        if ($barang->stok < $data['jumlah']) {
            return response()->json(['message' => 'Stok tidak cukup'], 422);
        }

        $trans = BarangKeluar::create($data);

        // update stok
        $barang->stok -= $data['jumlah'];
        $barang->save();

        return $trans->load('barang', 'user');
    }

    public function riwayatMasuk()
{
    // hanya yang sudah login
    $data = BarangMasuk::with('barang', 'user')
        ->orderBy('tanggal', 'desc')
        ->orderBy('created_at', 'desc')
        ->get();

    return $data;
}

public function riwayatKeluar()
{
    $data = BarangKeluar::with('barang', 'user')
        ->orderBy('tanggal', 'desc')
        ->orderBy('created_at', 'desc')
        ->get();

    return $data;
}

}

