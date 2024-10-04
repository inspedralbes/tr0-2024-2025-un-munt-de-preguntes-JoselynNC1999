<?php
// Mostrar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Asegúrate de que no haya espacio en blanco antes del header y JSON
header('Content-Type: application/json');

include 'conexio.php';  // Conexión a la base de datos

// Recibir los datos enviados por el frontend
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['pregunta'], $data['respostes'], $data['correcta'], $data['imatge'])) {
    try {
        // Empezar la transacción
        $conn->beginTransaction();

        // Insertar la nueva pregunta
        $sqlPregunta = "INSERT INTO preguntess (pregunta, resposta_correcta, imatge) VALUES (?, ?, ?)";
        $stmtPregunta = $conn->prepare($sqlPregunta);
        $stmtPregunta->execute([$data['pregunta'], null, $data['imatge']]);

        // Obtener el ID de la pregunta insertada
        $pregunta_id = $conn->lastInsertId();

        // Confirmar la transacción
        $conn->commit();

        echo json_encode(['success' => true]);

    } catch (PDOException $e) {
        $conn->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
}

$conn = null;
?>
