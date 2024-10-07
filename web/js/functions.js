let estatdelaPartida = { //Este objeto guarda el estado actual del juego
    preguntes: [], //guardan las preguntas y respuestas cuando se cargan desde el backend.
    contadorRespostes: 0,
    preguntaActual: 0
  };
  
  // Se hace una solicitud HTTP a getPreguntes.php para obtener las preguntas en formato JSON
  fetch('../backend/getPreguntes.php')
    .then(response => {
      console.log(response); // Para verificar qué está devolviendo el servidor
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Verificar que los datos se reciben
      pintaPreguntes(data); // Función para pintar preguntas en el DOM
    })
    .catch(error => console.error('Error al obtener los datos:', error));
  
  // Función para pintar preguntas
  function pintaPreguntes(data) {
    let opcions = ['A', 'B', 'C', 'D'];
    let preguntes = data.preguntes; // Obtener el array de preguntas
    let htmlString = '';
  
    estatdelaPartida.preguntes = preguntes.map(p => ({
      pregunta: p.pregunta, // Asegúrate de que esto coincida con tu JSON
      respostes: p.respostes, // Asegúrate de que la estructura sea correcta
      resposta: -1 //Inicialmente no se ha seleccionado ninguna respuesta
    }));
  
    htmlString += `<div class='contenidorTitol'><h1> ¡Endevina l'any de la pel.licula!</h1></div>`;
  
    // Genera el HTML para cada pregunta
    for (let i = 0; i < preguntes.length; i++) {
      htmlString += `<div class='preguntaWrapper'>`;
      htmlString += `<div class='preguntaContent'>`;
      htmlString += `<p>${i + 1}. ${preguntes[i].pregunta}</p>`;
      htmlString += `<img src="${preguntes[i].imatge}" alt="Pregunta ${i + 1}">`; // Mostrar la imagen
      htmlString += `</div>`;
      htmlString += `<div class='opciones'>`;
      // Botones para las opciones de respuesta
      for (let j = 0; j < opcions.length; j++) {
        htmlString += `<button onclick="reaccio(${i}, ${j})">${opcions[j]}: ${preguntes[i].respostes[j].etiqueta}</button><br>`;
      }
  
      htmlString += "</div>";
      htmlString += `</div>`;
    }
  
    const divPartida = document.getElementById("partida"); // buscando un elemento en el HTML que tenga el ID "partida
    if (divPartida) {
      divPartida.innerHTML = htmlString; // inserta el contenido HTML (que está en la variable htmlString
    } else {
      console.error('No es troba id "partida"');
    }
  }
  
  // Función para gestionar respuestas
  function reaccio(pregunta, resposta) {
    console.log(`Pregunta ${pregunta + 1}, opción seleccionada: ${resposta + 1}`);
    
    if (estatdelaPartida.preguntes[pregunta].resposta === -1) {
      estatdelaPartida.contadorRespostes++;
    }
    // Guarda la respuesta seleccionada
    estatdelaPartida.preguntes[pregunta].resposta = resposta;
    actualitzarMarcador();
  }
  
  function actualitzarMarcador() {
    let htmlString = `<h2>${estatdelaPartida.contadorRespostes}/10</h2>`;
    htmlString += '<table>';
  
    for (let i = 0; i < estatdelaPartida.preguntes.length; i++) {
      htmlString += `<tr><td>Pregunta ${i + 1}</td>`;
      if (estatdelaPartida.preguntes[i].resposta !== -1) {
        htmlString += `<td>Respondida</td>`;
      } else {
        htmlString += `<td>Pendiente</td>`;
      }
      htmlString += '</tr>';
    }
  
    htmlString += '</table>';
    document.getElementById("marcador").innerHTML = htmlString;
  } 