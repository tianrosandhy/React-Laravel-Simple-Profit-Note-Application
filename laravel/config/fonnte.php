<?php
return [
    'base_url' => env('FONNTE_BASE_URL', 'https://api.fonnte.com'),
    'token' => env('FONNTE_TOKEN'),
    'device_id' => env('FONNTE_DEVICE_ID'),
    'fallback_recipient' => env('FALLBACK_FONNTE_RECIPIENT'),

    'whitelist_recipient' => [],
];