<?php
// Conexión a la base de datos
$servername = "localhost:3306";
$username = "a23josnincal_a23josnincal";
$password = "JoselynNinahuaman22";
$dbname = "a23josnincal_bbdd_joselyn";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Establecer charset a UTF-8 para evitar problemas de codificación
$conn->set_charset("utf8");

// No cierras la conexión aquí
?>
