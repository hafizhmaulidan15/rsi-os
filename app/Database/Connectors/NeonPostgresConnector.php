<?php

namespace App\Database\Connectors;

use Illuminate\Database\Connectors\PostgresConnector;

class NeonPostgresConnector extends PostgresConnector
{
    protected function getDsn(array $config)
    {
        $dsn = parent::getDsn($config);

        if (! empty($config['neon_endpoint_id'])) {
            $dsn .= ";options='endpoint={$config['neon_endpoint_id']}'";
        }

        return $dsn;
    }
}
