<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Database\Seeders\DatabaseSeeder;
use App\Models\Component;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('components', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('url');
            $table->text('category');
            $table->text('type')->default('dawn');
            $table->text('file_name');
            $table->text('thumbnail_url')->nullable();
            $table->float('price');
        });




    }

    public function down(): void
    {
        Schema::dropIfExists('components');
    }
};
