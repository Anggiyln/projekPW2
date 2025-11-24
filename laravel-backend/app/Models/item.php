<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'kategori',
        'merk',
        'satuan',
        'stok',
        'harga',
    ];

    protected $casts = [
        'stok' => 'integer',
        'harga' => 'decimal:2',
    ];
}
