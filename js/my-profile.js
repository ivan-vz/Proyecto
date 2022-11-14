//Funcion al cargar la pagina
document.addEventListener("DOMContentLoaded", async function (e) {
  verificarInicioDeSesion();
  placeHolderAndPhoto();
});

//Funcion para actualizar visualmente los datos del perfil
const placeHolderAndPhoto = () => {
  let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));

  document.getElementById("emailPerfil").value = perfilIniciado.email;
  document.getElementById("pName").value = perfilIniciado.name;
  document.getElementById("sName").value = perfilIniciado.secondName;
  document.getElementById("pSurname").value = perfilIniciado.surname;
  document.getElementById("sSurname").value = perfilIniciado.secondSurname;
  document.getElementById("telefono").value = perfilIniciado.phone;
  if (perfilIniciado.img) {
    document.getElementById("fotoPerfil").innerHTML = `
      <img src="${perfilIniciado.img}" class="border border-primary border-5 float-lg-end"  style="border-radius: 1em; width: 10em; height: 10em;" alt="fotoPerfil">
    `
  } else {
    document.getElementById("fotoPerfil").innerHTML = `
      <img src="img/img_perfil.png" class="border border-primary border-5 float-lg-end"  style="border-radius: 1em; width: 10em; height: 10em;" alt="fotoPerfil">
    `
  }
};

//Funcion que cancela el submit del guardar datos en caso de no cumplir las condiciones
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
        const toastGuardarP = document.getElementById('toastGuardar');
        const toast = new bootstrap.Toast(toastGuardarP)

        toast.show()
        setTimeout(function () {
          toast.hide();
        }, 3000);
      }

    }, false)
  })
})()

//condicion
//Controle que el email no exista
const emailLibre = () => {
  let registroUsuarios = JSON.parse(localStorage.getItem("registroUsuarios"));
  let perfilActual = JSON.parse(localStorage.getItem("perfilIniciado"));
  let emailAModificar = document.getElementById("emailPerfil");

  if (emailAModificar.value.trim() != "") {
    let existeEmail = registroUsuarios.find((usuario) => {
      return (usuario.email === emailAModificar.value);
    });

    if (existeEmail) {
      if (existeEmail.password === perfilActual.password) {
        emailAModificar.setCustomValidity("");
      } else {
        emailAModificar.setCustomValidity("Ya en uso");
      }
    } else {
      emailAModificar.setCustomValidity("");
    }
  } else {
    emailAModificar.setCustomValidity("Incorrecto");
  }
};

//Funcion para actualizar los datos del perfil
const modificarDatosDeUsuario = () => {
  let pNombre = document.getElementById("pName");
  let sNombre = document.getElementById("sName");
  let pApellido = document.getElementById("pSurname");
  let sApellido = document.getElementById("sSurname");
  let telefono = document.getElementById("telefono");
  let email = document.getElementById("emailPerfil");

  let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));

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
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    perfilIniciado.img = url;
    localStorage.setItem("perfilIniciado", JSON.stringify(perfilIniciado));
    actualizarRegistroPerfiles();
  }

  read.readAsDataURL(file[0]);
}