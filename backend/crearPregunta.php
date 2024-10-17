<?php
header('Content-Type: application/json');

include 'conexio.php'; 
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);


if (!isset($data['pregunta']) || !isset($data['respostes']) || !isset($data['correcta'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

$pregunta = $conn->real_escape_string($data['pregunta']);
$correcta = (int)$data['correcta'];

// Insertar la nueva pregunta
$sqlPregunta = "INSERT INTO preguntess (pregunta, resposta_correcta) VALUES ('$pregunta', $correcta)";
if ($conn->query($sqlPregunta) === TRUE) {
    $preguntaId = $conn->insert_id;

    // Insertar las respuestas
    foreach ($data['respostes'] as $respuesta) {
        $etiqueta = $conn->real_escape_string($respuesta['etiqueta']);
        $sqlRespuesta = "INSERT INTO respostes (preguntess_id, etiqueta) VALUES ($preguntaId, '$etiqueta')";
        $conn->query($sqlRespuesta);
    }

    echo json_encode(["success" => true, "message" => "Pregunta creada exitosamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al crear la pregunta: " . $conn->error]);
}

$conn->close();
?>
