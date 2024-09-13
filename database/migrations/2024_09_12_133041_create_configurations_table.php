<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Configuration;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('configurations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name')->nullable()->default(null);
            $table->text('color')->nullable()->default(null);;
            $table->text('configuration');
            $table->text('identifier');
            $table->text('componentList')->nullable();
        });


    }


    public function down(): void
    {

    }
};
