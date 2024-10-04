<?php
include 'conexio.php';  // Conexión a la base de datos

// Obtener el ID de la pregunta a eliminar desde la URL
if (!isset($_GET['id'])) {
    echo json_encode(["error" => "ID de pregunta no proporcionado"]);
    exit();
}

$pregunta_id = $_GET['id'];

try {
    // Empezar la transacción
    $conn->beginTransaction();

    // Eliminar la pregunta (puedes eliminar las respuestas si fuera necesario, pero no está claro si tienes una tabla separada)
    $sql_pregunta = "DELETE FROM preguntess WHERE id = ?";
    $stmt_pregunta = $conn->prepare($sql_pregunta);
    $stmt_pregunta->execute([$pregunta_id]);

    // Confirmar la transacción
    $conn->commit();

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    // En caso de error, revertir la transacción
    $conn->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn = null;
?>
