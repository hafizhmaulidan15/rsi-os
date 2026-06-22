<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;

class SettingController extends Controller
{
    public function index() { return Setting::all(); }
    public function update(\Illuminate\Http\Request $request) {
        foreach ($request->input('settings', []) as $setting) {
            Setting::where('key', $setting['key'])->update(['value' => $setting['value']]);
        }
        return Setting::all();
    }
}
