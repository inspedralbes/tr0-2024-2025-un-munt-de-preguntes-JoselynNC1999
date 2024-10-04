// Estado de la partida
let estatdelaPartida = {
    preguntes: [],
    contadorRespostes: 0,
    preguntaActual: 0,
    contadorCorrectes: 0
};

// Elementos del DOM
const partidaDiv = document.getElementById("partida");
const marcadorDiv = document.getElementById("marcador");
const finalizarButton = document.getElementById("finalitzar");
const tornarIniciButton = document.getElementById("inicio");

// Función para renderizar la página inicial
function renderPaginaInicial() {
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    if (nombreUsuario) {
        partidaDiv.innerHTML = `
            <h2 >¡Hola, ${nombreUsuario}!</h2>
            <p>Quantes preguntes vols jugar?</p>
            <form id="formularioPreguntas">
                <input type="number" id="numeroPreguntas" min="1" max="50" placeholder="Nombre de preguntes" required>
                <button type="submit">Començar a Jugar!</button>
            </form>
            <button id="borrarNombre" class="botonAuxiliar">Canviar nom del jugador</button>
        `;

        document.getElementById("formularioPreguntas").addEventListener("submit", manejarInicioJuego);
        document.getElementById("borrarNombre").addEventListener("click", borrarNombreUsuario);
    } else {
        partidaDiv.innerHTML = `
            <h2>Endevina la pel·lícula</h2>
            <form id="formularioNombre">
                <input type="text" id="nombreUsuario" placeholder="Introdueix el teu nom" required>
                <input type="number" id="numeroPreguntas" min="1" max="50" placeholder="Nombre de pel·lícules que vols jugar" required>
                <button type="submit">Començar a Jugar!</button>
            </form>
        `;

        document.getElementById("formularioNombre").addEventListener("submit", manejarEnvioNombre);
    }
}


// Función para manejar el envío del nombre y comenzar el juego
function manejarEnvioNombre(event) {
    event.preventDefault();
    const nombreUsuario = document.getElementById("nombreUsuario").value;
    const numeroPreguntas = document.getElementById("numeroPreguntas").value;

    if (nombreUsuario && numeroPreguntas) {
        localStorage.setItem("nombreUsuario", nombreUsuario);
        reiniciarEstadoPartida();
        obtenirPreguntes(numeroPreguntas);
    }
}

// Función para manejar el inicio del juego
function manejarInicioJuego(event) {
    event.preventDefault();
    const numeroPreguntas = document.getElementById("numeroPreguntas").value;
    if (numeroPreguntas > 0 && numeroPreguntas <= 50) {  // Validar que el número de preguntas esté en el rango permitido
        reiniciarEstadoPartida();
        obtenirPreguntes(numeroPreguntas);
    } else {
        alert("Por favor, elige un número de preguntas entre 1 y 50.");  // Mostrar una advertencia si el número es inválido
    }
}



// Función para borrar el nombre guardado en localStorage
function borrarNombreUsuario() {
    localStorage.removeItem("nombreUsuario");
    renderPaginaInicial(); // Volver a renderizar la vista de inicio
}
// Función para reiniciar el estado de la partida
function reiniciarEstadoPartida() {
    estatdelaPartida = {
        preguntes: [],
        contadorRespostes: 0,
        preguntaActual: 0,
   
    };
    marcadorDiv.innerHTML = '';  // Limpiar el marcador
    partidaDiv.innerHTML = '';   // Limpiar la pantalla de preguntas
    finalizarButton.style.display = "none"; // Ocultar el botón de finalizar
}
// Función para obtener preguntas del backend
function obtenirPreguntes(numPreguntes) {
    fetch(`../backend/getPreguntes.php?numPreguntes=${numPreguntes}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Añadir un console.log aquí para ver qué se recibe
            if (data.error) {
                throw new Error(data.error);
            }
            pintaPreguntes(data); // Pintar preguntas en el DOM
        })
        .catch(error => console.error('Error al obtener las preguntas:', error));
}



// Función para pintar preguntas en el DOM
function pintaPreguntes(preguntes) {
    estatdelaPartida.preguntes = preguntes.map((p) => ({
        pregunta: p.pregunta,
        respostes: p.respostes,
        resposta: -1, // Inicialmente no hay respuesta
        imatge: p.imatge,
        id: p.id
    }));

    estatdelaPartida.preguntaActual = 0;
    console.log(estatdelaPartida.preguntes); // Añadir un console.log aquí para verificar las preguntas
    mostrarPregunta(estatdelaPartida.preguntaActual);
    finalizarButton.style.display = "flex"; 
}

// Función para mostrar una pregunta con botones de navegación
function mostrarPregunta(index) {
    const pregunta = estatdelaPartida.preguntes[index];
    let htmlString = `<div class='preguntaWrapper' data-pregunta-index="${index}">`;

    // Mostrar la pregunta en el centro
    htmlString += `<div class='preguntaContent'>`;
    htmlString += `<p>${index + 1}. ${pregunta.pregunta}</p>`;
    htmlString += `</div>`;

    // Contenedor para la imagen y las opciones, uno al lado del otro
    htmlString += `<div class='imagenOpciones'>`;

    // Mostrar la imagen a la izquierda
    if (pregunta.imatge) {
        htmlString += `<img src="${pregunta.imatge}" alt="Pregunta ${index + 1}">`;
    }

    // Mostrar las opciones a la derecha
    htmlString += `<div class='opciones'>`;
    pregunta.respostes.forEach((resp, j) => {
        htmlString += `<button class="opcion-btn" data-opcion-index="${resp.id}">${String.fromCharCode(65 + j)}: ${resp.etiqueta}</button>`;
    });
    htmlString += `</div>`;

    htmlString += `</div>`; // Cerrar el contenedor de imagen y opciones

    // Botones de navegación (atrás y adelante)
    htmlString += `<footer class="navigationButtons">`;
    if (index > 0) {
        htmlString += `<button class="botonAtras">Endarrera</button>`;
    }
    if (index < estatdelaPartida.preguntes.length - 1) {
        htmlString += `<button class="botonAdelante">Endavant</button>`;
    }
    htmlString += `</footer>`;

    htmlString += `</div>`; // Cerrar la preguntaWrapper
    partidaDiv.innerHTML = htmlString;
}


// Función para gestionar las respuestas
function reaccio(preguntaIndex, idResposta) {
    const pregunta = estatdelaPartida.preguntes[preguntaIndex];
    if (idResposta === pregunta.resposta_correcta) {
        estatdelaPartida.contadorCorrectes++;
    }
    
    if (pregunta.resposta === -1) { // Solo permite responder si no ha sido respondida
        estatdelaPartida.contadorRespostes++;

    
        // Guardar la respuesta del usuario
        pregunta.resposta = idResposta;

        estatdelaPartida.preguntaActual++;

        if (estatdelaPartida.preguntaActual < estatdelaPartida.preguntes.length) {
            mostrarPregunta(estatdelaPartida.preguntaActual);
        } else {
            finalizarJuego(); // Finaliza el juego
        }
    }
}


function irAtras() {
    if (estatdelaPartida.preguntaActual > 0) {
        estatdelaPartida.preguntaActual--;  // Restar uno al índice actual
        mostrarPregunta(estatdelaPartida.preguntaActual);  // Mostrar la pregunta anterior
    }
}

function irAdelante() {
    if (estatdelaPartida.preguntaActual < estatdelaPartida.preguntes.length - 1) {
        estatdelaPartida.preguntaActual++;  // Sumar uno al índice actual
        mostrarPregunta(estatdelaPartida.preguntaActual);  // Mostrar la siguiente pregunta
    }
}

partidaDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("opcion-btn")) {
        // Obtener el índice de la pregunta y la opción seleccionada
        const preguntaIndex = parseInt(e.target.closest('.preguntaWrapper').dataset.preguntaIndex);
        const respuestaIndex = parseInt(e.target.dataset.opcionIndex);
        
        reaccio(preguntaIndex, respuestaIndex);
    }

    if (e.target.classList.contains("botonAtras")) {
        irAtras();  // Llamada a la función para ir a la pregunta anterior
    }

    if (e.target.classList.contains("botonAdelante")) {
        irAdelante();  // Llamada a la función para ir a la siguiente pregunta
    }
});

// Función para finalizar el juego (envía respuestas al backend)
function finalizarJuego() {
    let respostesUsuari = generarBodyDeRespuestas();

    fetch('../backend/finalitza.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ respostes: respostesUsuari })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al finalizar: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        mostrarResultadoFinal(data.correctes, data.totalPreguntes, data.detallesRespuestas);
        //localStorage.removeItem("nombreUsuario"); // Eliminar el nombre del usuario
        //renderPaginaInicial(); // Volver a la página inicial
        tornarIniciButton.style.display = "flex";
        finalizarButton.style.display = "none";
    })
    .catch(error => console.error('Error al finalizar:', error));
}


// Función para generar el cuerpo de respuestas a enviar al backend
function generarBodyDeRespuestas() {
    let body = [];
    
    // Recorremos todas las preguntas y guardamos las respuestas
    for (let i = 0; i < estatdelaPartida.preguntes.length; i++) {
        let bodyObj = {
            "idPregunta": estatdelaPartida.preguntes[i].id,
            "idResposta": estatdelaPartida.preguntes[i].resposta // Guardamos la respuesta elegida
        }
        body.push(bodyObj); // Añadimos al cuerpo
    }
    
    return body; // Devolvemos el cuerpo de respuestas
}


// Función para mostrar el resultado final con la lista de preguntas y respuestas correctas
function mostrarResultadoFinal(correctes, totalPreguntes, detalleRespuestas) {
    // Mostrar cuántas preguntas se han acertado
    partidaDiv.innerHTML = `<h2>¡Has acertado ${correctes}/${totalPreguntes} preguntas!</h2>`;

    let htmlString = '<ul>'; // Iniciar la lista

    // Iterar sobre cada pregunta para mostrar detalles
    detalleRespuestas.forEach((detalle, index) => {
        let pregunta = estatdelaPartida.preguntes.find(pregunta => pregunta.id === detalle.pregunta);

        if (pregunta) {
            let textoPregunta = pregunta.pregunta;

            let textoRespuestaCorrecta = 
                pregunta.respostes.find(resposta =>  parseInt(resposta.id) === detalle.respuestaCorrecta)?.etiqueta || "no s'ha trobat la resposta";

            let textoPregunstaSeleccionada = 
                pregunta.respostes.find(respuesta => parseInt(respuesta.id) === detalle.respuestaUsuario)?.etiqueta || "no s'ha trobat la resposta";
            // Comenzar el elemento de la lista para esta pregunta
            htmlString += `<li><strong>Pregunta ${index + 1}:</strong> ${textoPregunta}<br>`;

            // Mostrar la respuesta correcta
            htmlString += `Respuesta correcta: <strong>${textoRespuestaCorrecta}</strong><br>`;

            // Mostrar la respuesta del usuario
            htmlString += `Tu respuesta: <strong>${textoPregunstaSeleccionada}</strong><br>`;

            // Mostrar si la respuesta fue correcta o incorrecta
            if (detalle.isCorrecta) {
                htmlString += `<span style="color: green;">Estado: <strong>Correcta</strong></span><br>`; // Respuesta correcta
            } else {
                htmlString += `<span style="color: red;">Estado: <strong>Incorrecta</strong></span><br>`; // Respuesta incorrecta
            }

            htmlString += `</li>`; // Cerrar el elemento de la lista
        }
        
    });

    htmlString += '</ul>'; // Cerrar la lista
    partidaDiv.innerHTML += htmlString; // Agregar la lista al div de resultados

    // Mostrar el botón de "Volver al inicio" (si aplica)
    finalizarButton.style.display = "none"; // Ocultar el botón de finalizar
    document.getElementById("inicio").style.display = "block"; // Mostrar el botón de volver al inicio
}




// Función para finalizar el juego (envía respuestas al backend)
finalizarButton.addEventListener("click", function() {
   finalizarJuego();
});


// Iniciar la SPA
renderPaginaInicial();



