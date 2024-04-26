<?php
return [
    'max_consecutive_failures' => 500, // max consecutive failures before blocking user
    'max_attempts' => 300, // max OTP request attempts before blocking user
    'digits' => 6,
    'otp_age' => 5, // in minutes (OTP will be valid for n minutes)
    'wait_duration' => 1, // in minutes (wait for n minutes before sending another OTP)
    'block_duration' => 30, // in minutes (block user for n minutes after max attempts reached)
];