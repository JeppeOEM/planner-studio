<?php

namespace App\Http\Controllers;
use App\Models\Component;
use Illuminate\Http\Request;
use Inertia\Response;

class EditorController extends Controller
{
  
    
    public function index() : Response
    {
        $components = Component::all()->makeHidden(['created_at', 'updated_at']);
    
        return inertia('editor/editor', [
            'components' => $components
        ]);
    }
}
