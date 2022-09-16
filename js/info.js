 let infoUsuario = JSON.parse(localStorage.getItem("datosUser")); // A la variable "emailName" le asigno el email del objeto datosUser
 document.getElementById("emailLogin").innerHTML = infoUsuario.email; // Ubico a la etiqueta (Ubicado en inicio.html) con id "emailLogin" y le agrego como contenido a la variable emailName

document.getElementById("volverArriba").addEventListener("click", () => {
    window.location = "#";
});