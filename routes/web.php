
<?php

use App\Http\Controllers\EditorController;
use App\Http\Controllers\ComponentController;
use Illuminate\Support\Facades\Route;

Route::get('/', [EditorController::class, 'index'])->name('editor.index');

Route::get('/component', [ComponentController::class, 'getFileUrl']);
