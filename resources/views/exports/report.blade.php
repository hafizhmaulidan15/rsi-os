<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title ?? 'Laporan' }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #1F2937; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2563EB; padding-bottom: 10px; }
        .header h1 { color: #0F172A; font-size: 18px; margin: 0; }
        .header p { color: #6B7280; font-size: 10px; margin: 4px 0 0 0; }
        .meta { margin-bottom: 15px; font-size: 9px; color: #6B7280; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #2563EB; color: white; padding: 7px 6px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 6px; border-bottom: 1px solid #E5E7EB; font-size: 9px; }
        tr:nth-child(even) td { background: #F9FAFB; }
        .pass { color: #16A34A; font-weight: bold; }
        .reject { color: #DC2626; font-weight: bold; }
        .footer { text-align: center; color: #9CA3AF; font-size: 8px; margin-top: 20px; border-top: 1px solid #E5E7EB; padding-top: 8px; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 8px; font-weight: bold; }
        .badge-pass { background: #16A34A20; color: #16A34A; }
        .badge-reject { background: #DC262620; color: #DC2626; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RSI OS — {{ $title ?? 'Laporan' }}</h1>
        <p>Rumah Susu Indonesia • Sistem ERP Produksi Susu</p>
    </div>

    <div class="meta">
        Dicetak: {{ now()->format('d F Y H:i') }} | Total: {{ count($items) }} data
    </div>

    <table>
        <thead>
            <tr>
                @if(!empty($columns))
                    @foreach($columns as $col)
                        <th>{{ $col }}</th>
                    @endforeach
                @elseif(!empty($items[0]))
                    @foreach(array_keys((array)$items[0]->toArray()[0] ?? []) as $col)
                        <th>{{ ucwords(str_replace('_', ' ', $col)) }}</th>
                    @endforeach
                @endif
            </tr>
        </thead>
        <tbody>
            @forelse($items as $item)
                <tr>
                    @if(!empty($columns))
                        @foreach($columns as $col)
                            <td>{!! $item[$col] ?? '-' !!}</td>
                        @endforeach
                    @else
                        @foreach((array)$item->toArray() as $val)
                            <td>{{ is_string($val) ? $val : (is_bool($val) ? ($val ? 'Ya' : 'Tidak') : json_encode($val)) }}</td>
                        @endforeach
                    @endif
                </tr>
            @empty
                <tr><td colspan="99" style="text-align:center;color:#9CA3AF;">Tidak ada data</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        RSI OS v{{ config('app.version', '1.0') }} | Dicetak otomatis dari sistem
    </div>
</body>
</html>
