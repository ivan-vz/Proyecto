document.addEventListener("DOMContentLoaded", async function (e) {
  verificarInicioDeSesion();
  placeHolderAndPhoto();
});

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
        //Funcion para el msj de guardado exitoso
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
    placeHolderAndPhoto();

  }

  read.readAsDataURL(file[0]);
}

//Funcion para actualizar los datos del perfil
const modificarDatosDeUsuario = () => {
  let pNombre = document.getElementById("pName");
  let sNombre = document.getElementById("sName");
  let pApellido = document.getElementById("pSurname");
  let sApellido = document.getElementById("sSurname");
  let telefono = document.getElementById("telefono");
  let email = document.getElementById("emailPerfil");

  let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
  if (perfilIniciado) {
    modificarDatosComentarios(perfilIniciado.name, pNombre.value);
    
    perfilIniciado.name = pNombre.value;
    perfilIniciado.secondName = sNombre.value;
    perfilIniciado.surname = pApellido.value;
    perfilIniciado.secondSurname = sApellido.value;
    perfilIniciado.email = email.value;
    perfilIniciado.phone = telefono.value;
    
    localStorage.setItem("perfilIniciado", JSON.stringify(perfilIniciado));
    actualizarRegistroPerfiles();
  } 

  pNombre.value = "";
  sNombre.value = "";
  pApellido.value = "";
  sApellido.value = "";
  telefono.value = "";
  email.value = "";

  verificarInicioDeSesion();
  placeHolderAndPhoto();
};

//Funcion para actualizar los datos de los input en pantalla
const placeHolderAndPhoto = () => {
  let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));

  if (!perfilIniciado) {
    document.getElementById("emailPerfil").value = "";
    document.getElementById("pName").value = "";
    document.getElementById("sName").value = "";
    document.getElementById("pSurname").value = "";
    document.getElementById("sSurname").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("fotoPerfil").innerHTML = "";
  } else {
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
  }
};