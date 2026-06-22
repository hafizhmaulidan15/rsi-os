<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>{{ $title ?? 'Report' }}</title>
<style>
body { font-family: sans-serif; font-size: 12px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
th { background: #2563EB; color: white; }
</style>
</head>
<body>
<h1>{{ $title ?? 'Report' }}</h1>
<table>
<thead><tr>
@if(!empty($items[0]))
@foreach(array_keys((array)$items[0]->toArray()[0] ?? []) as $col)<th>{{ $col }}</th>@endforeach
@endif
</tr></thead>
<tbody>
@foreach($items as $item)
<tr>
@foreach((array)$item->toArray() as $val)<td>{{ is_string($val) ? $val : json_encode($val) }}</td>@endforeach
</tr>
@endforeach
</tbody>
</table>
</body>
</html>
