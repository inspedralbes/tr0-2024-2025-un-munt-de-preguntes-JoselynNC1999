<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'conexio.php'; // Incluir el archivo de conexión

// Recibir los datos enviados por el frontend
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si se han recibido todos los datos necesarios
if (isset($data['id'], $data['pregunta'], $data['respostes'], $data['correcta'])) {
    // Iniciar una transacción
    $conn->begin_transaction();

    try {
        // Actualizar la pregunta principal
        $sqlPregunta = "UPDATE preguntess SET pregunta = ?, resposta_correcta = ? WHERE id = ?";
        $stmtPregunta = $conn->prepare($sqlPregunta);
        $stmtPregunta->bind_param('sii', $data['pregunta'], $data['correcta'], $data['id']); // 'sii' indica tipos: string, integer, integer
        $stmtPregunta->execute();

        // Actualizar las respuestas asociadas
        foreach ($data['respostes'] as $index => $resposta) {
            $sqlRespostes = "UPDATE respostes SET etiqueta = ? WHERE preguntess_id = ? AND id = ?";
            $stmtRespostes = $conn->prepare($sqlRespostes);
            $stmtRespostes->bind_param('sii', $resposta['etiqueta'], $data['id'], $resposta['id']);
            $stmtRespostes->execute();
        }

        // Confirmar la transacción si todo va bien
        $conn->commit();
        echo json_encode(['success' => true]);

    } catch (mysqli_sql_exception $e) {
        // Si hay un error, revertir la transacción
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
}
?>
