<?php
session_start();
?>

<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultat Final</title>
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
            width: 50%;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .container h1 {
            font-size: 2em;
            margin-bottom: 20px;
        }
        .container p {
            font-size: 1.5em;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 1em;
            cursor: pointer;
            margin-top: 20px;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Resultat Final</h1>
        <p>Has encertat <?php echo $_SESSION['puntuacio']; ?> de <?php echo count($_SESSION['preguntes']); ?> preguntes.</p>
        <form action="reiniciar.php" method="POST">
            <button type="submit">Torna a començar</button>
        </form>
    </div>
</body>
</html>
