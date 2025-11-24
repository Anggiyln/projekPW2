<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        
        Schema::create('items', function (Blueprint $table) {
        $table->id();
        $table->string('kode')->unique();
        $table->string('nama');
        $table->string('kategori')->nullable();
        $table->string('merk')->nullable();
        $table->string('satuan')->default('pcs');
        $table->integer('stok')->default(0);
        $table->decimal('harga', 12, 2)->nullable();
        $table->timestamps();
    });
}


public function down()
{
Schema::dropIfExists('items');
}
};