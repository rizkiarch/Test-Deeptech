<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class ApiProxyController extends Controller
{
    private string $apiGatewayUrl;
    private string $userServiceUrl;
    private string $dataServiceUrl;

    public function __construct()
    {
        $this->apiGatewayUrl = config('services.api_gateway.url', 'http://krakend:8080');
        $this->userServiceUrl = config('services.user_service.url', 'http://user-service:5001');
        $this->dataServiceUrl = config('services.data_service.url', 'http://data-service:5002');
    }

    /**
     * Proxy request to API Gateway
     */
    public function proxyToGateway(Request $request, string $path): JsonResponse
    {
        try {
            $method = $request->method();
            $url = $this->apiGatewayUrl . '/api/' . $path;
            $headers = $this->getForwardedHeaders($request);

            $response = Http::timeout(30)
                ->withHeaders($headers)
                ->send($method, $url, [
                    'json' => $request->all(),
                    'query' => $request->query(),
                ]);

            return response()->json(
                $response->json(),
                $response->status()
            );
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gateway connection failed',
                'message' => $e->getMessage()
            ], 503);
        }
    }

    /**
     * Health check endpoint
     */
    public function healthCheck(): JsonResponse
    {
        try {
            $services = [
                'api_gateway' => $this->checkServiceHealth($this->apiGatewayUrl . '/__health'),
                'user_service' => $this->checkServiceHealth($this->userServiceUrl . '/api/health'),
                'data_service' => $this->checkServiceHealth($this->dataServiceUrl . '/api/health'),
            ];

            $allHealthy = array_reduce($services, fn($carry, $service) => $carry && $service['healthy'], true);

            return response()->json([
                'status' => $allHealthy ? 'healthy' : 'degraded',
                'services' => $services,
                'timestamp' => now()->toISOString(),
            ], $allHealthy ? 200 : 503);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'unhealthy',
                'error' => $e->getMessage()
            ], 503);
        }
    }

    /**
     * Get forwarded headers for API requests
     */
    private function getForwardedHeaders(Request $request): array
    {
        $headers = [];

        if ($request->hasHeader('Authorization')) {
            $headers['Authorization'] = $request->header('Authorization');
        }

        if ($request->hasHeader('Content-Type')) {
            $headers['Content-Type'] = $request->header('Content-Type');
        }

        $headers['X-Forwarded-For'] = $request->ip();
        $headers['X-Forwarded-Host'] = $request->getHost();
        $headers['X-Forwarded-Proto'] = $request->getScheme();

        return $headers;
    }

    /**
     * Check service health
     */
    private function checkServiceHealth(string $url): array
    {
        try {
            $response = Http::timeout(5)->get($url);
            return [
                'healthy' => $response->successful(),
                'status' => $response->status(),
                'response_time' => $response->transferStats->getTransferTime() ?? 0,
            ];
        } catch (\Exception $e) {
            return [
                'healthy' => false,
                'error' => $e->getMessage(),
                'response_time' => null,
            ];
        }
    }
}
