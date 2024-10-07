<?php
// Iniciar la sesión
session_start();
include 'conexio.php'; 

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['idPregunta'])) {
    echo json_encode(["error" => "ID de la pregunta no proporcionado."]);
    exit();
}

$idPregunta = $data['idPregunta'];

// Borrar la pregunta de la base de datos
$sql = "DELETE FROM preguntess WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idPregunta);

if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Pregunta eliminada correctamente."]);
} else {
    echo json_encode(["error" => "Error al eliminar la pregunta."]);
}

$stmt->close();
$conn->close();
?>
