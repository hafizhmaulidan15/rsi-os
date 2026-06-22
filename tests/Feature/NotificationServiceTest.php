<?php

use App\Models\Notification;
use App\Services\NotificationService;

test('can create notification', function () {
    $service = app(NotificationService::class);
    $notification = $service->create(
        type: 'inventory_warning',
        title: 'Test Notification',
        message: 'This is a test',
    );

    expect($notification)->toBeInstanceOf(Notification::class);
    expect($notification->title)->toBe('Test Notification');
    expect($notification->is_read)->toBeFalse();
});

test('getUnreadCount returns correct count', function () {
    Notification::factory()->count(3)->create(['is_read' => false]);
    Notification::factory()->count(2)->create(['is_read' => true]);

    $service = app(NotificationService::class);
    $count = $service->getUnreadCount();

    expect($count)->toBe(3);
});

test('markAsRead updates notification', function () {
    $notification = Notification::factory()->create(['is_read' => false]);

    $service = app(NotificationService::class);
    $service->markAsRead($notification->id);

    $this->assertDatabaseHas('notifications', [
        'id' => $notification->id,
        'is_read' => true,
    ]);
});

test('markAllAsRead updates all unread', function () {
    Notification::factory()->count(3)->create(['is_read' => false]);

    $service = app(NotificationService::class);
    $service->markAllAsRead();

    expect(Notification::where('is_read', false)->count())->toBe(0);
});
