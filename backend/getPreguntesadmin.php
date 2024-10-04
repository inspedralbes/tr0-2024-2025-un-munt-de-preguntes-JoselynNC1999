<?php
include 'conexio.php';  

$sql = "SELECT p.id AS pregunta_id, p.pregunta, p.resposta_correcta, r.id AS resposta_id, r.etiqueta
        FROM preguntess p
        LEFT JOIN respostes r ON p.id = r.preguntess_id
        ORDER BY p.id";

$result = $conn->query($sql);

// Verificar si hay errores en la consulta
if ($conn->error) {
    die("Error en la consulta: " . $conn->error);
}

$preguntas = [];
$currentQuestion = null;

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Si es una nueva pregunta, añadimos la anterior al array
        if ($currentQuestion === null || $currentQuestion['id'] != $row['pregunta_id']) {
            if ($currentQuestion !== null) {
                $preguntas[] = $currentQuestion;
            }

            // Iniciar una nueva pregunta
            $currentQuestion = [
                'id' => $row['pregunta_id'],
                'pregunta' => $row['pregunta'],
                'respostes' => [], 
                'correcta' => $row['resposta_correcta']  
            ];
        }

        // Añadir las respuestas a la pregunta actual, si existen
        if (!empty($row['resposta_id'])) {
            $currentQuestion['respostes'][] = [
                'id' => $row['resposta_id'],
                'etiqueta' => $row['etiqueta']
            ];
        }
    }
    
    // Añadir la última pregunta procesada al array de preguntas
    if ($currentQuestion !== null) {
        $preguntas[] = $currentQuestion;
    }
}

// Devolver los resultados en formato JSON
header('Content-Type: application/json');
echo json_encode($preguntas);

$conn->close();
?>
