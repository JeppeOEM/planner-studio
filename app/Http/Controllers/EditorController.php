<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EditorController extends Controller
{
    function index(Request $request) {

        return inertia('editor/editor');
    }
}