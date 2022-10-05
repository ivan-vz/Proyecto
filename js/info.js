function cerrarS(){
    localStorage.removeItem("datosUser");
}

function setProductID(id) {
    localStorage.setItem("PID", id);
    window.location = "product-info.html"
}
 
 let infoUsuario = JSON.parse(localStorage.getItem("datosUser")); // A la variable "emailName" le asigno el email del objeto datosUser
 document.getElementById("emailLogin").innerHTML = infoUsuario.email; // Ubico a la etiqueta (Ubicado en inicio.html) con id "emailLogin" y le agrego como contenido a la variable emailName

document.getElementById("volverArriba").addEventListener("click", () => {
    window.location = "#";
});

//Funciones para mostrar y modificar la tabla del carrito (paso de productinfo a cart)
function unirSubir(){
    let nuevoproducto = JSON.parse(localStorage.getItem("nuevoProducto"));
    carrito = JSON.parse(localStorage.getItem("carroCompras"));
    if(!carrito){
        carrito = [];
        carrito.push(nuevoproducto);
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        
        document.getElementById("alert-success").classList.add("show");
        setTimeout(function() {
            document.getElementById("alert-success").classList.remove("show");
        }, 3000);
        
    } else if(!(carrito.find(({id}) => id === nuevoproducto.id))){
        carrito.push(nuevoproducto);
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        
        document.getElementById("alert-success").classList.add("show");
        setTimeout(function() {
            document.getElementById("alert-success").classList.remove("show");
        }, 3000);
    }
}