<?php
session_start();

// Procesar la respuesta enviada por el usuario
if (isset($_POST['resposta'])) {
    $respostaSeleccionada = intval($_POST['resposta']);
    $preguntaActual = $_SESSION['preguntes'][$_SESSION['contador']];

    // Verificar si la respuesta es correcta
    if ($respostaSeleccionada == $preguntaActual['correcta']) {
        $_SESSION['puntuacio']++;
    }

    // Si es la última pregunta, redirigir a resultat.php
    if ($_SESSION['contador'] == count($_SESSION['preguntes']) - 1) {
        header('Location: resultat.php');
        exit();
    } else {
        // Si no es la última pregunta, avanzar a la siguiente
        header('Location: index.php');
        exit();
    }
}
