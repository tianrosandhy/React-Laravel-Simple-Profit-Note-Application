<?php
namespace App\Services;

use Illuminate\Http\UploadedFile;
use Http;
use Exception;
use Log;
use Storage;

class Fonnte
{
    public $base_url;
    public $token;

    public function __construct()
    {
        $this->base_url = config('fonnte.base_url');
        $this->token = config('fonnte.token');
    }

	public function blastMessage($recipients, $message, $additional=[])
	{
		return $this->sendMessage($recipients, $message, $additional);
	}

    public function sendMessage($recipient, $message, $additional=[])
    {
        $endpoint = '/send';
        $param = [
            'target' => $recipient,
            // 'target' => '089622224614',
            'message' => $message,
            'delay' => rand(5, 10),
            'typing' => true,
        ];
        $param = array_merge($param, $additional);

        if (config('app.env') == 'local' && config('fonnte.fallback_recipient')) {
            // prevent send unwantend message to another user
            $param['target'] = config('fonnte.fallback_recipient');
        }

        // if (isset($additional['file'])) {
        //     if ($additional['file'] instanceof UploadedFile) {
        //         // upload first
        //         $filepath = $additional['file']->store('fonnte');
        //         $additional['file'] = Storage::url($filepath);
        //     }
        //     $param['file'] = $additional['file'];
        // }

        return $this->request($endpoint, $param);
    }

    public function request($endpoint, $param=[])
    {
        $param['token'] = $this->token;

        $response = Http::withOptions([
                'verify' => false
            ])
            ->accept('application/json')
            ->get($this->base_url . $endpoint . '?' . http_build_query($param));

        if (!$response->ok()) {
            // log
            $logparam = $param;
            $logparam['message'] = isset($param['message']) ? (strlen($param['message']) > 20 ? substr($param['message'], 0, 20) . '...' : $param['message']) : null;
            Log::error("ERROR RESPONSE fonnte", [
                'endpoint' => $this->base_url . $endpoint,
                'request' => $logparam,
                'response' => $response->body(),
                'status' => $response->status(),
            ]);

            throw new Exception("Error when connect to fonnte endpoint. Check log for more information");
        }

        $logparam = $param;
        $logparam['message'] = isset($param['message']) ? (strlen($param['message']) > 20 ? substr($param['message'], 0, 20) . '...' : $param['message']) : null;
        Log::info("OK RESPONSE fonnte", [
            'endpoint' => $this->base_url . $endpoint,
            'request' => $logparam,
            'response' => $response->body(),
            'status' => $response->status(),
        ]);

        return json_decode($response->body(), true);          
    }
}