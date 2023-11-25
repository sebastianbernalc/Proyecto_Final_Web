
const searchInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const text_input = document.querySelector("input");


const createButton = document.querySelector('.create button');

const deleteButton = document.querySelector('.delete button');
const delete_input = document.querySelector(".eliminar input");


var apiUrl = 'http://localhost:8080/jugadores'; 


searchButton.addEventListener('click', () => {
    consumeGet(searchInput.value);
    
});

createButton.addEventListener('click', () => {
    consumePost();
});

deleteButton.addEventListener('click', () => {
    consumeDelete(delete_input.value);
});


async function consumeGet(id) {
    const url = apiUrl +`/${id}`
    try {
        const response = await axios.get(url);
        mostrarDatosEnDOM(response.data);
        console.log(`La petición del servidor se completó correctamente con status: ${response.status}`);
        document.querySelector(".error_buscar").style.display = "none";
        return response.data;
    } catch (error) {
        console.error(`Falló la petición del servidor con error: ${error.message}`);
        document.querySelector(".error_buscar").style.display = "block";
        document.querySelector("#jugadorInfo").style.display = "none";
        return { error: error.message };
    }
}

async function consumeDelete(id) {
    const url = apiUrl +`/${id}`
    try {
        const response = await axios.delete(url);
        console.log(`La petición del servidor se completó correctamente con status: ${response.status}`);
        document.querySelector(".error_delete").style.display = "none";
        return response.data;
    } catch (error) {
        console.error(`Falló la petición del servidor con error: ${error.message}`);
        document.querySelector(".error_delete").style.display = "block";
        return { error: error.message };
    }
}

function mostrarDatosEnDOM(data) {
    // Accede al elemento en el DOM donde deseas mostrar la información
    var jugadorInfoElement = document.getElementById('jugadorInfo');

    // Crea elementos HTML y asigna los datos
    var nombreElement = document.createElement('p');
    nombreElement.textContent = 'Nombre: ' + data.nombre;

    var edadElement = document.createElement('p');
    edadElement.textContent = 'Edad: ' + data.edad;

    var alturaElement = document.createElement('p');
    alturaElement.textContent = 'Altura: ' + data.altura;

    var nacionalidadElement = document.createElement('p');
    nacionalidadElement.textContent = 'Nacionalidad: ' + data.nacionalidad;

    var clubElement = document.createElement('p');
    clubElement.textContent = 'Club: ' + data.club;

    var posicionElement = document.createElement('p');
    posicionElement.textContent = 'Posición: ' + data.posicion;

    var golesElement = document.createElement('p');
    golesElement.textContent = 'Goles: ' + data.goles;

    // Agrega los elementos creados al contenedor en el DOM
    jugadorInfoElement.innerHTML = ''; // Limpia el contenido existente
    jugadorInfoElement.appendChild(nombreElement);
    jugadorInfoElement.appendChild(edadElement);
    jugadorInfoElement.appendChild(alturaElement);
    jugadorInfoElement.appendChild(nacionalidadElement);
    jugadorInfoElement.appendChild(clubElement);
    jugadorInfoElement.appendChild(posicionElement);
    jugadorInfoElement.appendChild(golesElement);

    document.querySelector("#jugadorInfo").style.display = "block";
}

async function consumePost() {
    // Obtiene los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const edad = parseInt(document.getElementById("edad").value);
    const altura = parseFloat(document.getElementById("altura").value);
    const nacionalidad = document.getElementById("nacionalidad").value;
    const club = document.getElementById("club").value;
    const posicion = document.getElementById("posicion").value;
    const goles = parseInt(document.getElementById("goles").value);

    // Crea el objeto con los datos del jugador
    const jugadorData = {
        nombre: nombre,
        edad: edad,
        altura: altura,
        nacionalidad: nacionalidad,
        club: club,
        posicion: posicion,
        goles: goles
    };
    console.log(jugadorData);

    // Realiza la petición POST al servidor
    try {
        const response = await axios.post(apiUrl, jugadorData);
        console.log(`La petición POST se completó correctamente con status: ${response.status}`);
        document.querySelector(".error_crear").style.display = "none";
    } catch (error) {
        console.error(`Falló la petición POST con error: ${error.message}`);
        document.querySelector(".error_crear").style.display = "block";
    }
}
