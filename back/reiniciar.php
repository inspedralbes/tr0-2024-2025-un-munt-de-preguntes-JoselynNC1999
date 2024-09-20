<?php
session_start();
session_destroy(); // Destruir todas las variables de sesión para reiniciar el juego
header('Location: index.php'); // Redirigir al inicio del juego
exit();
