<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'qc_ts_min', 'value' => '11.0', 'group' => 'qc'],
            ['key' => 'qc_protein_min', 'value' => '2.8', 'group' => 'qc'],
            ['key' => 'qc_fat_min', 'value' => '3.0', 'group' => 'qc'],
            ['key' => 'qc_ph_min', 'value' => '6.4', 'group' => 'qc'],
            ['key' => 'qc_ph_max', 'value' => '6.8', 'group' => 'qc'],
            ['key' => 'shelf_life_default_days', 'value' => '14', 'group' => 'shelf_life'],
            ['key' => 'yield_default_factor', 'value' => '0.85', 'group' => 'yield'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                $setting,
            );
        }
    }
}
