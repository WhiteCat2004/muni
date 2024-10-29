// Mostrar el popup cuando se carga la página
window.onload = function() {
    document.getElementById('popup').classList.add('show');
};

// Función para cerrar el popup
function cerrarPopup() {
    document.getElementById('popup').classList.remove('show');
}

// Función para ajustar el número máximo de dígitos en el campo de entrada
function setMaxDigits() {
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento');

    if (tipoDocumento === 'dni') {
        numeroDocumento.maxLength = 8;
    } else if (tipoDocumento === 'cpp' || tipoDocumento === 'ce') {
        numeroDocumento.maxLength = 10;
    } else {
        numeroDocumento.maxLength = 10; // Valor por defecto
    }
}

// Función para manejar la búsqueda de licencia
document.getElementById('buscarBtn').addEventListener('click', function() {
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;

    if (tipoDocumento === '' || numeroDocumento === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Realizar la solicitud POST a la API
    fetch('http://192.168.18.5:3006/api/consultar-licencia', {  // Cambia 192.168.18.5 por tu IP local
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo_documento: tipoDocumento, numero_documento: numeroDocumento }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`${data.message}\nNombre: ${data.data.nombre} ${data.data.apellido}`);
        } else {
            alert(`${data.message}`);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Ocurrió un error al consultar la licencia.');
    });
});

// Función para manejar la consulta con GET (opcional)
document.getElementById('consultarBtn').addEventListener('click', function() {
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;

    if (tipoDocumento === '' || numeroDocumento === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Realizar la solicitud GET a la API
    fetch(`http://192.168.18.5:3006/api/consultar-licencia?tipo_documento=${tipoDocumento}&numero_documento=${numeroDocumento}`)  // Cambia 192.168.18.5 por tu IP local
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`${data.message}\nNombre: ${data.data.nombre} ${data.data.apellido}`);
        } else {
            alert(`${data.message}`);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Ocurrió un error al consultar la licencia.');
    });
});
