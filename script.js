
const searchInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const text_input = document.querySelector("input");

const main_search_button = document.getElementById("SearchButton");
const main_create_button = document.getElementById("CreateButton");
const main_delete_button = document.getElementById("DeleteButton");
const main_update_button = document.getElementById("UpdateBotton1");

const createButton = document.querySelector('.create button');

const deleteButton = document.querySelector('.delete button');
const delete_input = document.querySelector(".eliminar input");

const updateButton = document.querySelector('.update button');


var apiUrl = 'http://localhost:8080/jugadores'; 

main_search_button.addEventListener('click', () => {
    document.querySelector(".search").style.display = "block";
    document.querySelector(".crear").style.display = "none";
    document.querySelector(".eliminar").style.display = "none";
    document.querySelector(".actualizar").style.display = "none";
    document.querySelector("#jugadorInfo").style.display = "none";
    
});

main_create_button.addEventListener('click', () => {
    document.querySelector(".crear").style.display = "block";
    document.querySelector(".search").style.display = "none";
    document.querySelector(".eliminar").style.display = "none";
    document.querySelector(".actualizar").style.display = "none";
    document.querySelector("#jugadorInfo").style.display = "none";
});

main_delete_button.addEventListener('click', () => {
    document.querySelector(".eliminar").style.display = "block";
    document.querySelector(".crear").style.display = "none";
    document.querySelector(".search").style.display = "none";
    document.querySelector(".actualizar").style.display = "none";
    document.querySelector("#jugadorInfo").style.display = "none";
}   );

main_update_button.addEventListener('click', () => {
    document.querySelector(".actualizar").style.display = "block";
    document.querySelector(".crear").style.display = "none";
    document.querySelector(".eliminar").style.display = "none";
    document.querySelector(".search").style.display = "none";
    document.querySelector("#jugadorInfo").style.display = "none";
});



searchButton.addEventListener('click', () => {
    consumeGet(searchInput.value);
    
});

createButton.addEventListener('click', () => {
    consumePost();
});

deleteButton.addEventListener('click', () => {
    consumeDelete(delete_input.value);
});

updateButton.addEventListener('click', () => {
    consumeUpdate()
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
        alert('Jugador no encontrado!');
        return { error: error.message };
    }
}

async function consumeDelete(id) {
    const url = apiUrl +`/${id}`
    try {
        const response = await axios.delete(url);
        console.log(`La petición del servidor se completó correctamente con status: ${response.status}`);
        document.querySelector(".error_delete").style.display = "none";
        alert('Jugador eliminado!');
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
    if (nombre && !isNaN(edad) && !isNaN(altura) && nacionalidad && club && posicion && !isNaN(goles)){
        
        try {
            const response = await axios.post(apiUrl, jugadorData);
            console.log(`La petición POST se completó correctamente con status: ${response.status}`);
            document.querySelector(".error_crear").style.display = "none";
            alert('Jugador añadido!');
        } catch (error) {
            console.error(`Falló la petición POST con error: ${error.message}`);
            document.querySelector(".error_crear").style.display = "block";
            alert('No se pudo añadir al jugador!');
        }
    }
    else
        alert('Llene todos los campos!');  

    // Realiza la petición POST al servidor
        
}

async function consumeUpdate() {
    // Obtiene los valores del formulario
    const id = document.getElementById("id_update").value;
    const nombre = document.getElementById("nombre_update").value;
    const edad = parseInt(document.getElementById("edad_update").value);
    const altura = parseFloat(document.getElementById("altura_update").value);
    const nacionalidad = document.getElementById("nacionalidad_update").value;
    const club = document.getElementById("club_update").value;
    const posicion = document.getElementById("posicion_update").value;
    const goles = parseInt(document.getElementById("goles_update").value);

    // Crea el objeto con los datos del jugador
    const jugadorData = {};

    if (nombre !== "") {
        jugadorData.nombre = nombre;
    }

    if (!isNaN(edad)) {
        jugadorData.edad = edad;
    }

    if (!isNaN(altura)) {
        jugadorData.altura = altura;
    }

    if (nacionalidad !== "") {
        jugadorData.nacionalidad = nacionalidad;
    }

    if (club !== "") {
        jugadorData.club = club;
    }

    if (posicion !== "") {
        jugadorData.posicion = posicion;
    }

    if (!isNaN(goles)) {
        jugadorData.goles = goles;
    }

    console.log(Object.keys(jugadorData).length);

    // Realiza la petición PATCH al servidor
    const apiUpdate = apiUrl + `/${id}`;
    if (Object.keys(jugadorData).length> 0){
        try {
            const response = await axios.patch(apiUpdate, jugadorData);
            console.log(`La petición PATCH se completó correctamente con status: ${response.status}`);
            document.querySelector(".error_actualizar").style.display = "none";
            document.querySelector(".error_actualizar_dato").style.display = "none";
            alert('Jugador actualizado!');

        } catch (error) {
            console.error(`Falló la petición PATCH con error: ${error.message}`);
            if (Object.keys(jugadorData).length === 0)  {
                document.querySelector(".error_actualizar_dato").style.display = "block";
            }
            else
                document.querySelector(".error_actualizar").style.display = "block";
        }
    }
    else
        alert('Llene al menos un campo distinto al id!');
}

