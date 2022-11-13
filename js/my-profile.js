//Variables

//Inputs

let pNombre = document.getElementById("pName");
let sNombre = document.getElementById("sName");
let pApellido = document.getElementById("pSurname");
let sApellido = document.getElementById("sSurname");
let telefono = document.getElementById("telefono");
let email = document.getElementById("emailPerfil");

//Funcion que se activa al cargar la pagina
document.addEventListener("DOMContentLoaded", async function (e) {
  verificarInicioDeSesion();
  placeHolderAndPhoto();
});

//Funcion para actualizar los datos de los input en pantalla
const placeHolderAndPhoto = () => {
  let foto = document.getElementById("fotoPerfil");

  email.value = perfilIniciado.email;
  pNombre.value = perfilIniciado.name;
  sNombre.value = perfilIniciado.secondName;
  pApellido.value = perfilIniciado.surname;
  sApellido.value = perfilIniciado.secondSurname;
  telefono.value = perfilIniciado.phone;

  if (perfilIniciado.img) {
    foto.innerHTML = `
      <img src="${perfilIniciado.img}" class="border border-primary border-5 float-lg-end"  style="border-radius: 1em; width: 10em; height: 10em;" alt="fotoPerfil">
    `
  } else {
    foto.innerHTML = `
      <img src="img/img_perfil.png" class="border border-primary border-5 float-lg-end"  style="border-radius: 1em; width: 10em; height: 10em;" alt="fotoPerfil">
    `
  }
};

//Funcion Bootstrap que cancela el subit en caso de no cumplir las condiciones
(() => {

  const forms = document.querySelectorAll('.validacionPerfil')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
      if (form.checkValidity()) {
        modificarDatosDeUsuario();
        form.classList.remove('was-validated');

        const btntoast = document.getElementById('guardarB');
        const toastGuardarP = document.getElementById('toastGurdar');
        const toast = new bootstrap.Toast(toastGuardarP)

        toast.show()
        setTimeout(function () {
          toast.hide();
        }, 3000);
      }

    }, false)
  })
})()

//Funcion para actualizar los datos del perfil
const modificarDatosDeUsuario = () => {

  modificarDatosComentarios(perfilIniciado.name, pNombre.value);

  perfilIniciado.name = pNombre.value;
  perfilIniciado.secondName = sNombre.value;
  perfilIniciado.surname = pApellido.value;
  perfilIniciado.secondSurname = sApellido.value;
  perfilIniciado.email = email.value;
  perfilIniciado.phone = telefono.value;

  localStorage.setItem("perfilIniciado", JSON.stringify(perfilIniciado));
  actualizarRegistroPerfiles();
  verificarInicioDeSesion();
  placeHolderAndPhoto();
};

//Funcion para cambiar la foto
document.getElementById("inputFoto").onchange = function () {

  const read = new FileReader();
  const file = this.files;

  read.onload = function () {
    const result = read.result;
    const url = result;
    perfilIniciado.img = url;
    localStorage.setItem("perfilIniciado", JSON.stringify(perfilIniciado));
    actualizarRegistroPerfiles();
    placeHolderAndPhoto();

  }

  read.readAsDataURL(file[0]);
}