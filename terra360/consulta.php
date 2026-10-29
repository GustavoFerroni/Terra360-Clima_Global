<?php

// Define que a resposta deste arquivo será enviada no formato JSON.

header("Content-Type: application/json; charset=UTF-8");

// Confere se a requisição recebeu as duas coordenadas necessárias.
if (!isset($_GET["latitude"]) || !isset($_GET["longitude"])) {
    http_response_code(400);

    echo json_encode([
        "erro" => "Informe a latitude e a longitude."
    ]);

    exit;
}

// Converte os valores recebidos para números decimais e valida o formato.
$latitude = filter_var(
    $_GET["latitude"],
    FILTER_VALIDATE_FLOAT
);

$longitude = filter_var(
    $_GET["longitude"],
    FILTER_VALIDATE_FLOAT
);

// Verifica se as coordenadas são válidas e estão dentro dos limites do planeta.
if (
    $latitude === false ||
    $longitude === false ||
    $latitude < -90 ||
    $latitude > 90 ||
    $longitude < -180 ||
    $longitude > 180
) {
    http_response_code(400);

    echo json_encode([
        "erro" => "As coordenadas informadas são inválidas."
    ]);

    exit;
}

// Monta o endereço da API Open-Meteo com as coordenadas e os dados desejados.
$url = "https://api.open-meteo.com/v1/forecast"
    . "?latitude=" . urlencode((string) $latitude)
    . "&longitude=" . urlencode((string) $longitude)
    . "&current=temperature_2m,relative_humidity_2m,"
    . "apparent_temperature,is_day,precipitation,weather_code"
    . "&timezone=auto";

// Configura a chamada HTTP e define um limite de espera de 10 segundos.
$contexto = stream_context_create([
    "http" => [
        "method" => "GET",
        "timeout" => 10,
        "ignore_errors" => true
    ]
]);

// Faz a consulta à API e guarda a resposta recebida.
$resposta = @file_get_contents($url, false, $contexto);

// Se a API não responder, devolve um erro para o JavaScript.
if ($resposta === false) {
    http_response_code(502);

    echo json_encode([
        "erro" => "Não foi possível consultar a API meteorológica."
    ]);

    exit;
}

// Transforma o JSON da API em um array PHP.
$dados = json_decode($resposta, true);

// Confere se a resposta contém os dados meteorológicos esperados.
if (
    !is_array($dados) ||
    !isset($dados["current"]["temperature_2m"])
) {
    http_response_code(502);

    echo json_encode([
        "erro" => "A API retornou dados inválidos."
    ]);

    exit;
}

// Organiza os dados em nomes mais simples para o site utilizar.
$resultado = [
    "temperatura" => $dados["current"]["temperature_2m"],
    "sensacao_termica" => $dados["current"]["apparent_temperature"] ?? null,
    "umidade" => $dados["current"]["relative_humidity_2m"] ?? null,
    "precipitacao" => $dados["current"]["precipitation"] ?? null,
    "codigo_clima" => $dados["current"]["weather_code"] ?? null,
    "horario" => $dados["current"]["time"] ?? null,
    "fuso_horario" => $dados["timezone"] ?? null
];

// Envia o resultado como JSON, mantendo os caracteres acentuados legíveis.
echo json_encode(
    $resultado,
    JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
);

?>
