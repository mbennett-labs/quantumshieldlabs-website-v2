<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$path = $_GET['path'] ?? '';
$ec2_url = 'http://3.133.137.92:3001/' . ltrim($path, '/');

$opts = ['http' => [
    'method' => $_SERVER['REQUEST_METHOD'],
    'header' => 'Content-Type: application/json',
    'content' => file_get_contents('php://input'),
    'ignore_errors' => true
]];

$response = file_get_contents($ec2_url, false, stream_context_create($opts));
$status = $http_response_header[0] ?? 'HTTP/1.1 200 OK';
header($status);
header('Content-Type: application/json');
echo $response;
