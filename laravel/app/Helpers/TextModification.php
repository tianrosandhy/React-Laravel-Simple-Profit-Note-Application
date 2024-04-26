<?php
function normalizePhone($phone_number)
{
    $phone_number = preg_replace('/[^0-9]/', '', $phone_number);
    if (substr($phone_number, 0, 1) == '0') {
        $phone_number = '62' . substr($phone_number, 1);
    }
    if (substr($phone_number, 0, 1) != '6') {
        $phone_number = '62' . $phone_number;
    }
    return $phone_number;
}

function randomString($length=36) {
    return substr(bin2hex(random_bytes($length)), 0, $length);
}