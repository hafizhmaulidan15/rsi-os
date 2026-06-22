<?php

namespace App\Enums;

enum BatchStatus: string
{
    case PendingQc = 'pending_qc';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Consumed = 'consumed';
}
