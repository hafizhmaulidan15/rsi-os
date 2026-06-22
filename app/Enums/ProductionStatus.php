<?php

namespace App\Enums;

enum ProductionStatus: string
{
    case Production = 'production';
    case Chiller = 'chiller';
    case Ready = 'ready';
    case Closed = 'closed';
}
