document.addEventListener("DOMContentLoaded",async function(e){
  
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
          if(form.checkValidity()){
            modificarDatosDeUsuario();
            form.classList.remove('was-validated');
            //Funcion para el msj de guardado exitoso
            const toastTrigger = document.getElementById('guardarB');
            const toastLiveExample = document.getElementById('liveToast');
            const toast = new bootstrap.Toast(toastLiveExample)

            toast.show()
            setTimeout(function() {
              toast.hide();
            }, 3000);
          }

      }, false)
    })
})()

document.getElementById("inputFoto").onchange = function(){//Input tipo file

  const read = new FileReader(); //Objeto que le permite a la web leer archivos locales
  const file = this.files; //Hace referencia a la foto seleccionada
  
  read.onload = function(){ //onload se ejecuta cuando el elemento read es leido con readAsDataURL ==> es como una funcion async
    const result = read.result;
    const url = result;
    let Usuario = JSON.parse(localStorage.getItem("datosUser")); 
    Usuario.img = url;
    localStorage.setItem("datosUser", JSON.stringify(Usuario));
    placeHolderAndPhoto();

  }
  
  read.readAsDataURL(file[0]); //Funcion que codifica la image y la manda como resultado de una promesa 
}

const modificarDatosDeUsuario = () => {
  let pNombre = document.getElementById("pName").value;
  let sNombre = document.getElementById("sName").value;
  let pApellido = document.getElementById("pSurname").value;
  let sApellido = document.getElementById("sSurname").value;
  let telefono = document.getElementById("telefono").value;
  let email = document.getElementById("emailPerfil").value;

  let Usuario = JSON.parse(localStorage.getItem("datosUser"));
  if(Usuario != null){
      Usuario.name = pNombre;
      Usuario.secondName = sNombre;
      Usuario.surname = pApellido;
      Usuario.secondSurname = sApellido;
      Usuario.email = email;
      Usuario.phone = telefono;

      localStorage.setItem("datosUser", JSON.stringify(Usuario));
      document.getElementById("emailPerfil").setAttribute('placeholder', email);
  }

  document.getElementById("pName").value = "";
  document.getElementById("sName").value = "";
  document.getElementById("pSurname").value = "";
  document.getElementById("sSurname").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("emailPerfil").value = "";
  
  verificarInicioDeSesion();
  placeHolderAndPhoto();
};

const placeHolderAndPhoto = () => {
  let Usuario = JSON.parse(localStorage.getItem("datosUser"));
  if(!Usuario){
    document.getElementById("emailPerfil").removeAttribute('placeholder');
    document.getElementById("pName").removeAttribute('placeholder');
    document.getElementById("sName").removeAttribute('placeholder');
    document.getElementById("pSurname").removeAttribute('placeholder');
    document.getElementById("sSurname").removeAttribute('placeholder');
    document.getElementById("telefono").removeAttribute('placeholder');
    document.getElementById("fotoPerfil").innerHTML = " ";
  } else {
    document.getElementById("emailPerfil").setAttribute('placeholder', Usuario.email);
    document.getElementById("pName").setAttribute('placeholder', Usuario.name);
    document.getElementById("sName").setAttribute('placeholder', Usuario.secondName);
    document.getElementById("pSurname").setAttribute('placeholder', Usuario.surname);
    document.getElementById("sSurname").setAttribute('placeholder', Usuario.secondSurname);
    document.getElementById("telefono").setAttribute('placeholder', Usuario.phone);
    if(Usuario.img){
      document.getElementById("fotoPerfil").innerHTML = `
      <img src="${Usuario.img}" class="border border-primary border-5 float-end" style="border-radius: 1em; width: 10em; height: 10em;" alt="fotoPerfil">
    `
    } else {
      document.getElementById("fotoPerfil").innerHTML = `
      <img src="img/img_perfil.png" class="border border-primary border-5 float-end" style="border-radius: 1em; width: 10em; height: 10em;" alt="fotoPerfil">
    `
    }
  }
};