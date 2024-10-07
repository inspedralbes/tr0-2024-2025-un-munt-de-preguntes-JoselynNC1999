<?php
session_start(); 

include 'conexio.php'; 

if (!isset($_SESSION['puntuacion'])) {
    $_SESSION['puntuacion'] = 0;
}

// Obtener el número de preguntas solicitado
$numPreguntes = isset($_GET['numPreguntes']) ? intval($_GET['numPreguntes']) : 10;

$sql_preguntes = "
    SELECT DISTINCT p.id AS pregunta_id, p.pregunta, p.resposta_correcta, p.imatge
    FROM preguntess p
    ORDER BY RAND()
    LIMIT ?";

// Preparar la consulta de preguntas
$stmt_preguntes = $conn->prepare($sql_preguntes);
$stmt_preguntes->bind_param("i", $numPreguntes);
$stmt_preguntes->execute();
$result_preguntes = $stmt_preguntes->get_result();

$preguntes = [];
$pregunta_ids = [];

// Recoger todas las preguntas
while ($row = $result_preguntes->fetch_assoc()) {
    $preguntes[$row['pregunta_id']] = [
        "id" => $row["pregunta_id"],
        "pregunta" => $row["pregunta"],
        "imatge" => $row["imatge"],
        "resposta_correcta" => $row["resposta_correcta"], // Asegúrate de que esto está incluido
        "respostes" => [] // Inicializa las respuestas como un array vacío
    ];
    $pregunta_ids[] = $row['pregunta_id'];
}


// Si no hay preguntas, devolver error
if (empty($pregunta_ids)) {
    echo json_encode(["error" => "No se encontraron preguntas"]);
    exit();
}

// Convertir el array de IDs de preguntas en una lista separada por comas
$pregunta_ids_str = implode(',', $pregunta_ids);

// Obtener respuestas para esas preguntas SIN ordenar aleatoriamente
$sql_respostes = "
    SELECT r.id AS resposta_id, r.etiqueta, r.preguntess_id
    FROM respostes r
    WHERE r.preguntess_id IN ($pregunta_ids_str)";

// Ejecutar la consulta de respuestas
$result_respostes = $conn->query($sql_respostes);

// Comprobar si hay un error en la consulta de respuestas
if (!$result_respostes) {
    echo json_encode(["error" => "Error en la consulta de respuestas: " . $conn->error]);
    exit();
}

// Asignar respuestas a las preguntas correspondientes
while ($row = $result_respostes->fetch_assoc()) {
    if (isset($preguntes[$row['preguntess_id']])) {
        $preguntes[$row['preguntess_id']]['respostes'][] = [
            "id" => $row["resposta_id"],
            "etiqueta" => $row["etiqueta"]
        ];
    }
}

// Filtrar las preguntas que tienen exactamente 4 respuestas
$preguntes_finales = [];
foreach ($preguntes as $pregunta) {
    if (count($pregunta['respostes']) == 4) {
        shuffle($pregunta['respostes']);
        unset($pregunta['resposta_correcta']);
        $preguntes_finales[] = $pregunta;
    }
}

// Si el número de preguntas finales es menor al solicitado, devolver lo que hay
if (count($preguntes_finales) < $numPreguntes) {
    echo json_encode([
        "error" => "No se encontraron suficientes preguntas con 4 respuestas."
    ]);
} else {
    header('Content-Type: application/json');
    echo json_encode($preguntes_finales);
}

$stmt_preguntes->close();
$conn->close();
?>
