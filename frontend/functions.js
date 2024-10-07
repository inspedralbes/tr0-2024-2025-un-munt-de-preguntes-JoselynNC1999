// Estado de la partida
let estatdelaPartida = {
    preguntes: [],
    contadorRespostes: 0,
    preguntaActual: 0,

};
let tiempoInicio = null;
let intervaloCronometro = null;

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
            <h2>Endevina l'any de la pel·lícula</h2>
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

    marcadorDiv.innerHTML = '';  
    partidaDiv.innerHTML = '';   
    finalizarButton.style.display = "none"; 

    // Iniciar cronómetro
    tiempoInicio = new Date();  
    clearInterval(intervaloCronometro); 

    intervaloCronometro = setInterval(() => {
        let tiempoActual = (new Date() - tiempoInicio) / 1000;  // Tiempo en segundos
        document.getElementById("temporizador").textContent = `Temps: ${tiempoActual.toFixed(1)} segons`;
    }, 100);  
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
            //console.log(data); // Añadir un console.log aquí para ver qué se recibe
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
        respuestaElegida: -1, 
        imatge: p.imatge,
        id: p.id
    }));

    estatdelaPartida.preguntaActual = 0;
    mostrarPregunta(estatdelaPartida.preguntaActual);
    finalizarButton.style.display = "flex";
}

// Función para mostrar una pregunta con botones de navegación
function mostrarPregunta(index) {
    const pregunta = estatdelaPartida.preguntes[index];
    let htmlString = `<div class='preguntaWrapper' data-pregunta-index="${index}">`;

    // Mostrar la pregunta
    htmlString += `<div class='preguntaContent'>`;
    htmlString += `<p>${index + 1}. ${pregunta.pregunta}</p>`;
    htmlString += `</div>`;

    htmlString += `<div class='imagenOpciones'>`;

    if (pregunta.imatge) {
        htmlString += `<img src="${pregunta.imatge}" alt="Pregunta ${index + 1}">`;
    }

    // Mostrar las opciones
    htmlString += `<div class='opciones'>`;
    pregunta.respostes.forEach((resp, j) => {
        htmlString += `<button class="opcion-btn" data-opcion-index="${resp.id}">${String.fromCharCode(65 + j)}: ${resp.etiqueta}</button>`;
    });
    htmlString += `</div>`;

    htmlString += `</div>`;  

    // Botones de navegación
    htmlString += `<footer class="navigationButtons">`;
    if (index > 0) {
        htmlString += `<button class="botonAtras">Endarrera</button>`;
    }
    if (index < estatdelaPartida.preguntes.length - 1) {
        htmlString += `<button class="botonAdelante">Endavant</button>`;
    }
    htmlString += `</footer>`;

    htmlString += `</div>`;  

    // Actualizar solo las preguntas, sin eliminar el cronómetro
    partidaDiv.innerHTML = htmlString;
}



function reaccio(preguntaIndex, idResposta) {
    const pregunta = estatdelaPartida.preguntes[preguntaIndex];
    
    if (pregunta.respuestaElegida === -1) { // Solo permite responder si no ha sido respondida
        estatdelaPartida.contadorRespostes++;
        // Guardar la respuesta elegida del usuario
        pregunta.respuestaElegida = idResposta;
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
        estatdelaPartida.preguntaActual++;  
        mostrarPregunta(estatdelaPartida.preguntaActual);  // Mostrar la siguiente pregunta
    }
}

partidaDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("opcion-btn")) {
        // Obtener el índice de la pregunta y la opción seleccionada
        const preguntaIndex = parseInt(e.target.closest('.preguntaWrapper').dataset.preguntaIndex);
        const respuestaIndex = parseInt(e.target.dataset.opcionIndex);
        
        reaccio(preguntaIndex, respuestaIndex); // Registrar respuesta, pero no avanzar
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
    clearInterval(intervaloCronometro);  // Detener el cronómetro

    let tiempoTotal = (new Date() - tiempoInicio) / 1000;  // Calcular el tiempo total en segundos

    // Código para enviar respuestas al backend
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
        mostrarResultadoFinal(data.correctes, data.totalPreguntes, data.detallesRespuestas, tiempoTotal);
        tornarIniciButton.style.display = "flex";
        finalizarButton.style.display = "none";
    })
    .catch(error => console.error('Error al finalizar:', error));
}



// Función para generar el cuerpo de respuestas a enviar al backend
function generarBodyDeRespuestas() {
    let body = [];
    
    for (let i = 0; i < estatdelaPartida.preguntes.length; i++) {
        let bodyObj = {
            "idPregunta": estatdelaPartida.preguntes[i].id,
            "idResposta": estatdelaPartida.preguntes[i].respuestaElegida // Solo la respuesta elegida
        };
        body.push(bodyObj); 
    }
    
    return body; 
}

function mostrarResultadoFinal(correctes, totalPreguntes, detalleRespuestas, tiempoTotal) {
    // Mostrar cuántas preguntas se han acertado
    partidaDiv.innerHTML = `<h2>¡Has acertat ${correctes}/${totalPreguntes} preguntes!</h2>`;
    
    // Mostrar el tiempo total con una sola decimal
    partidaDiv.innerHTML += `<h3>Temps total: ${tiempoTotal.toFixed(1)} segons</h3>`;

    let htmlString = '<ul>';

    // Iterar sobre cada pregunta para mostrar detalles
    detalleRespuestas.forEach((detalle, index) => {
        let pregunta = estatdelaPartida.preguntes.find(pregunta => pregunta.id === detalle.pregunta);

        if (pregunta) {
            let textoPregunta = pregunta.pregunta;

            let textoRespuestaCorrecta = 
                pregunta.respostes.find(resposta =>  parseInt(resposta.id) === detalle.respuestaCorrecta)?.etiqueta || "no s'ha trobat la resposta";

            let textoPregunstaSeleccionada = 
                pregunta.respostes.find(respuesta => parseInt(respuesta.id) === detalle.respuestaUsuario)?.etiqueta || "no s'ha trobat la resposta";

            htmlString += `<li><strong>Pregunta ${index + 1}:</strong> ${textoPregunta}<br>`;

            htmlString += `Resposta correcta: <strong>${textoRespuestaCorrecta}</strong><br>`;

            htmlString += `La teva resposta: <strong>${textoPregunstaSeleccionada}</strong><br>`;

            if (detalle.isCorrecta) {
                htmlString += `<span style="color: green;">Estado: <strong>Correcta</strong></span><br>`; // Respuesta correcta
            } else {
                htmlString += `<span style="color: red;">Estado: <strong>Incorrecta</strong></span><br>`; // Respuesta incorrecta
            }

            htmlString += `</li>`; 
        }
    });

    htmlString += '</ul>'; 
    partidaDiv.innerHTML += htmlString; 

    finalizarButton.style.display = "none"; 
    document.getElementById("inicio").style.display = "block"; 
}

finalizarButton.addEventListener("click", function() {
   finalizarJuego();
});

renderPaginaInicial();



