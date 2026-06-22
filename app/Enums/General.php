<?php

namespace App\Enums;

enum ProductionType: string
{
    case Mozzarella = 'mozzarella';
    case SusuCup = 'susu_cup';
}

enum QCType: string
{
    case Raw = 'raw';
    case Pasteurized = 'pasteurized';
    case Mozzarella = 'mozzarella';
}

enum QCResult: string
{
    case Pass = 'pass';
    case Reject = 'reject';
}

enum TransactionType: string
{
    case In = 'in';
    case Out = 'out';
    case Adjustment = 'adjustment';
}

enum InventoryCategory: string
{
    case Mozzarella = 'mozzarella';
    case SusuCup = 'susu_cup';
    case Packaging = 'packaging';
}

enum NotificationType: string
{
    case InventoryWarning = 'inventory_warning';
    case ShelfLifeWarning = 'shelf_life_warning';
    case QcWarning = 'qc_warning';
}

enum NotificationSeverity: string
{
    case Info = 'info';
    case Warning = 'warning';
    case Critical = 'critical';
}
