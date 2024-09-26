<?php
// Leer el archivo JSON
$json = file_get_contents('data.json'); 

// Verificar si la lectura fue exitosa
if ($json === false) {
    // Enviar una respuesta de error si no se pudo leer el archivo
    echo json_encode(["error" => "No se pudo leer el archivo JSON"]);
    http_response_code(500); // Enviar código de error 500 (Error del servidor)
    exit; //detiene la ejecución del script. No se sigue con el resto del código porque hubo un error
}

// Decodificar y verificar si es un JSON válido
$preguntes = json_decode($json, true);
if ($preguntes === null) {
    // Enviar una respuesta de error si el JSON no es válido
    echo json_encode(["error" => "JSON no válido"]);
    http_response_code(500); // Enviar código de error 500
    exit;
}

// Devolver las preguntas en formato JSON
echo json_encode($preguntes);
?>