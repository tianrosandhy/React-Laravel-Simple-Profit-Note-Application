<?php

namespace App\Http\Controllers;

use App\Models\Label;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function index()
    {
        $page = request()->get('page', 1);
        $per_page = request()->get('per_page', 100);

        $labels = Label::paginate($per_page, ['*'], 'page', $page);

        return okJson($labels, "Labels data");
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'color' => 'required|string',
        ]);

        $check_title_exists = Label::where('title', $request->title)->first();
        if ($check_title_exists) {
            return errJson("Label title already exists");
        }

        $label = Label::create([
            'member_id' => request()->get('member')->id,
            'title' => $request->title,
            'color' => $request->color,        
        ]);

        return okJson($label, "Label created");
    }

    public function show($id)
    {
        $label = Label::findOrFail($id);

        return okJson($label, "Label data");
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'color' => 'required|string',
        ]);

        $check_title_exists = Label::where('title', $request->title)->where('id', '<>', $id)->first();
        if ($check_title_exists) {
            return errJson("Label title already exists");
        }

        $label = Label::findOrFail($id);
        $label->update([
            'title' => $request->title,
            'color' => $request->color,        
        ]);

        return okJson($label, "Label updated");
    }

    public function destroy($id)
    {
        $label = Label::findOrFail($id);
        $label->delete();

        return okJson(null, "Label deleted");
    }
}