<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="RSI OS — Sistem operasional, manajemen, dan monitoring produksi susu pasteurisasi Rumah Susu Indonesia.">
        <meta name="theme-color" content="#0F172A">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Open Graph -->
        <meta property="og:title" content="{{ config('app.name') }}">
        <meta property="og:description" content="RSI OS — Sistem operasional, manajemen, dan monitoring produksi susu pasteurisasi Rumah Susu Indonesia.">
        <meta property="og:type" content="website">
        <meta property="og:image" content="{{ url('logo-rsi.webp') }}">

        <!-- Favicon -->
        <link rel="icon" type="image/webp" href="/logo-rsi.webp">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Font Awesome 6 -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
