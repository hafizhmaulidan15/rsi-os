<?php

namespace App\Http\Middleware;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $isLoggedIn = $request->user() !== null;
        $notificationService = app(NotificationService::class);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'notifications' => $isLoggedIn ? $notificationService->getUnread(5) : [],
                'unread_count' => $isLoggedIn ? $notificationService->getUnreadCount() : 0,
            ],
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                    'warning' => session('warning'),
                    'info' => session('info'),
                ];
            },
        ];
    }
}
