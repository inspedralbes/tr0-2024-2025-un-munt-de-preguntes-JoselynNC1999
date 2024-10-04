<?php
session_start(); 

$_SESSION['puntuacion'] = 0;
$_SESSION['preguntaActual'] = 0;

// Respuesta para confirmar la inicialización
echo json_encode(['estado' => 'satisfactorio']);
?>
