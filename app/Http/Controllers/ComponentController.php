<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ComponentController extends Controller
{
    public function getFileUrl(Request $request)
    {
        $filename = $request->input('filename');
        $type = $request->input('type');

        if (!$filename || !$type) {
            return response()->json(['error' => 'Filename and type are required'], 400);
        }

        $path = '/public/' . $type . '/' . $filename;
        
        if (!Storage::exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $url = Storage::url($path);

        return response()->json(['url' => $url]);
    }
}
