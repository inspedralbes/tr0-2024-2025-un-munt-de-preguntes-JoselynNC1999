<?php
session_start();

// Inicializar el juego si es la primera vez que se carga la página
if (!isset($_SESSION['preguntes'])) {
    $json = file_get_contents('data.json'); // Leer preguntas desde un archivo JSON
    $data = json_decode($json, true);
    $preguntes = $data['preguntes'];

    // Seleccionar 10 preguntas al azar
    $_SESSION['preguntes'] = array_slice($preguntes, 0, 10);
    $_SESSION['contador'] = 0;
    $_SESSION['puntuacio'] = 0;
}

// Botón "Siguiente" o "Atrás"
if (isset($_POST['accion'])) {
    if ($_POST['accion'] == 'siguiente' && $_SESSION['contador'] < count($_SESSION['preguntes']) - 1) {
        $_SESSION['contador']++;
    } elseif ($_POST['accion'] == 'atras' && $_SESSION['contador'] > 0) {
        $_SESSION['contador']--;
    }
}

// Obtener la pregunta actual
$preguntaActual = $_SESSION['preguntes'][$_SESSION['contador']];
$totalPreguntes = count($_SESSION['preguntes']);
?>

<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Endevina l'any de la pel·lícula</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            width: 60%;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .pregunta-contenedor {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        img {
            width: 40%;
            height: auto;
        }
        .opciones {
            width: 50%;
            text-align: left;
        }
        .opciones button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            margin: 5px 0;
            cursor: pointer;
            width: 100%;
        }
        .opciones button:hover {
            background-color: #45a049;
        }
        .navigation {
            margin-top: 20px;
        }
        .contador {
            margin-top: 10px;
        }
        .navegacion-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .navegacion-buttons button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            width: 48%;
        }
        .navegacion-buttons button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Endevina l'any de la pel·lícula</h1>

        <div class="pregunta-contenedor">
            <img src="<?php echo $preguntaActual['imatge']; ?>" alt="Pregunta">
            <div class="opciones">
                <form action="validar.php" method="POST">
                    <?php foreach ($preguntaActual['respostes'] as $index => $resposta): ?>
                        <button type="submit" name="resposta" value="<?php echo $index; ?>">
                            <?php echo chr(65 + $index) . ': ' . $resposta['etiqueta']; ?>
                        </button>
                    <?php endforeach; ?>
                </form>
            </div>
        </div>

        <div class="contador">
            Pregunta <?php echo $_SESSION['contador'] + 1; ?> de <?php echo $totalPreguntes; ?>
        </div>

        <!-- Botones de Navegación -->
        <div class="navegacion-buttons">
            <form action="index.php" method="POST">
                <button type="submit" name="accion" value="atras" <?php echo $_SESSION['contador'] == 0 ? 'disabled' : ''; ?>>Atrás</button>
                <button type="submit" name="accion" value="siguiente" <?php echo $_SESSION['contador'] == $totalPreguntes - 1 ? 'disabled' : ''; ?>>Siguiente</button>
            </form>
        </div>
    </div>
</body>
</html>
