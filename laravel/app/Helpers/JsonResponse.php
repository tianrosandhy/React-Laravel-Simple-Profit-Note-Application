<?php
function errJson($message, $http_code = 400, $err_code=null, $err_data=null)
{
    return response()->json([
        'type' => 'error',
        'message' => $message,
        'err_code' => $err_code ?? null,
        'data' => $err_data ?? null,
    ], $http_code);
}

function okJson($data=null, $message=null)
{
    return response()->json([
        'type' => 'success',
        'message' => $message ?? 'OK',
        'data' => $data ?? null,
    ]);
}