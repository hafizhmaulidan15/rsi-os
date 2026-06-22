<?php

namespace App\Services;

use App\Models\Setting;

class QCEngine
{
    public function evaluate(array $data): array
    {
        $warnings = [];
        $result = 'pass';

        if (isset($data['antibiotic']) && strtolower($data['antibiotic']) === 'positive') {
            return ['result' => 'reject', 'warnings' => ['Antibiotic Positive']];
        }

        if (isset($data['peroxide']) && strtolower($data['peroxide']) === 'positive') {
            return ['result' => 'reject', 'warnings' => ['Peroxide Positive']];
        }

        $thresholds = $this->getThresholds();

        if (isset($data['total_solids']) && $data['total_solids'] < $thresholds['ts_min']) {
            $warnings[] = 'TS Rendah';
        }

        if (isset($data['protein']) && $data['protein'] < $thresholds['protein_min']) {
            $warnings[] = 'Protein Rendah';
        }

        if (isset($data['fat']) && $data['fat'] < $thresholds['fat_min']) {
            $warnings[] = 'Fat Rendah';
        }

        if (isset($data['ph']) && ($data['ph'] < $thresholds['ph_min'] || $data['ph'] > $thresholds['ph_max'])) {
            $warnings[] = 'pH Tidak Ideal';
        }

        if (isset($data['aroma']) && $data['aroma'] !== 'normal') {
            $warnings[] = 'Aroma Tidak Normal';
        }

        if (isset($data['taste']) && $data['taste'] !== 'normal') {
            $warnings[] = 'Rasa Tidak Normal';
        }

        if (isset($data['texture']) && $data['texture'] !== 'normal') {
            $warnings[] = 'Tekstur Tidak Normal';
        }

        if (!empty($warnings)) {
            $result = 'reject';
        }

        return [
            'result' => $result,
            'warnings' => $warnings,
        ];
    }

    private function getThresholds(): array
    {
        return [
            'ts_min' => (float) Setting::where('key', 'qc_ts_min')->value('value') ?? 11.0,
            'protein_min' => (float) Setting::where('key', 'qc_protein_min')->value('value') ?? 2.8,
            'fat_min' => (float) Setting::where('key', 'qc_fat_min')->value('value') ?? 3.0,
            'ph_min' => (float) Setting::where('key', 'qc_ph_min')->value('value') ?? 6.4,
            'ph_max' => (float) Setting::where('key', 'qc_ph_max')->value('value') ?? 6.8,
        ];
    }
}
