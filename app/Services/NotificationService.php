<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public function create(string $type, string $title, ?string $message = null, ?string $notifiableType = null, ?int $notifiableId = null, ?array $data = null): Notification
    {
        return Notification::create([
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'notifiable_type' => $notifiableType,
            'notifiable_id' => $notifiableId,
            'data' => $data,
            'is_read' => false,
        ]);
    }

    public function getUnread(int $limit = 10)
    {
        return Notification::where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function markAsRead(int $id): void
    {
        Notification::where('id', $id)->update(['is_read' => true, 'read_at' => now()]);
    }

    public function markAllAsRead(): void
    {
        Notification::where('is_read', false)->update(['is_read' => true, 'read_at' => now()]);
    }

    public function getUnreadCount(): int
    {
        return Notification::where('is_read', false)->count();
    }
}
