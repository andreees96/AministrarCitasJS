//CAMPOS DEL FORMULARIO
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas'); 

let editando;

//CLASES
class Citas{
    constructor(){
        this.citas = []; //crea un arreglo vacío
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita]
        console.log(this.citas);
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI{
    imprimirAlerta(mensaje, tipo){
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //agregar clase en base al tipo 
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //quitar la alerta
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas({citas}){
        this.limpiarHTML();

        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id; //agregamos el atributo id

            //scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
            `;

            //Boton para eliminar cita 
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            btnEliminar.onclick = () => eliminarCita(id);

            //boton editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
            btnEditar.onclick = () => cargarEdicion(cita);

            //agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

//EVENTOS
eventListeners();
function eventListeners(){
    mascotaInput.addEventListener('change', datosCitas);
    propietarioInput.addEventListener('change', datosCitas);
    telefonoInput.addEventListener('change', datosCitas);
    fechaInput.addEventListener('change', datosCitas);
    horaInput.addEventListener('change', datosCitas);
    sintomasInput.addEventListener('change', datosCitas);

    formulario.addEventListener('submit', nuevaCita);
}

//OBJETO PRINCIPAL
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//--FUNCIONES--

//función: agrega datos al objeto de cita
function datosCitas(e){
    //para que esto funcione debemos tener declarados los name
    citaObj[e.target.name] = e.target.value;
}

//función: válida y agrega una nueva cita a la clase de citas
function nuevaCita(e){
    e.preventDefault();

    //extraer información del objeto de citas
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatirios', 'error');
        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado correctamente');
        //pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj});
        //regresar el texto del boton
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
        //quitar modo edición
        editando = false;
    }else{
        //generar un id único
        citaObj.id = Date.now();
        //creando una nueva cita
        administrarCitas.agregarCita({...citaObj});//pasa una copia del objeto cita
        //mensaje
        ui.imprimirAlerta('Se agregó correctamente');
    }
    //reiniciar el objeto
    reiniciarObjeto();

    formulario.reset();

    //mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);
}

//función: resetea el objeto
function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.elefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

//función: elimina una cita
function eliminarCita(id){
    //elimina la cita
    administrarCitas.eliminarCita(id);
    //imprimir mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');
    //refrescar las citas
    ui.imprimirCitas(administrarCitas);
}

//carga los datos y el modo edición
function cargarEdicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita; //extrae los datos de la cita que le estamos pasando

    //llenar los imputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}