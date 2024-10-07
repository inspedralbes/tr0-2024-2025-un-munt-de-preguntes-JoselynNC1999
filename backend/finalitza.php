<?php
session_start(); 
include 'conexio.php'; 

if (!isset($_SESSION['puntuacion'])) {
    $_SESSION['puntuacion'] = 0;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['respostes'])) {
    echo json_encode(["error" => "No se recibieron respuestas."]);
    exit();
}

$respuestas = $data['respostes'];
$puntuacion = 0;
$totalPreguntes = count($respuestas);
$detalle = []; 

// Lógica para calcular la puntuación
foreach ($respuestas as $respuesta) {
    $preguntaId = $respuesta['idPregunta'];
    $respuestaId = $respuesta['idResposta'];

    // Obtener la respuesta correcta para la pregunta dada
    $sql = "SELECT resposta_correcta FROM preguntess WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $preguntaId);
    $stmt->execute();
    $stmt->bind_result($resposta_correcta);
    $stmt->fetch();
    $stmt->close();

    // Verifica si la respuesta dada es la correcta
    if ($respuestaId == $resposta_correcta) {
        $puntuacion++;
    }

    // Guarda los detalles de la respuesta del usuario
    $detalle[] = [
        "pregunta" => $preguntaId,
        "respuestaCorrecta" => $resposta_correcta, 
        "respuestaUsuario" => $respuestaId,
        "isCorrecta" => ($respuestaId == $resposta_correcta) 
    ];
}

// Actualizar la puntuación en la sesión
$_SESSION['puntuacion'] = $puntuacion;

// Respuesta JSON al frontend
echo json_encode([
    'totalPreguntes' => $totalPreguntes,
    'correctes' => $puntuacion,
    'detallesRespuestas' => $detalle
]);

$conn->close();
?>
