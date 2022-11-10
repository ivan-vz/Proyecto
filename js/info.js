(() => {
    const forms = Array.from(document.querySelectorAll('.validacionLogin'));
  
    forms.forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');

        if (form.checkValidity()) {
            crearUsuario();
            verificarInicioDeSesion();
            form.classList.remove('was-validated');
            document.getElementById("closeB").click();
            if(window.location.pathname === "/cart.html"){
                document.getElementById("botonFinalizarCompra").removeAttribute("disabled");
            }
          
        } 
            
      }, false)
    })
  })()

let inputNoVacio = Array.from(document.querySelectorAll('.sinEspacios'));
//Funcion que controla que los input numericos no sean vacios
const sinEspacios = () => {
    inputNoVacio.forEach((input) => {
        if(input.value.includes(" ")){
            input.setCustomValidity("Caracteres invalidos");
        } else {
            input.setCustomValidity("");
        }
    });
};

let noVaciosConEspacios = Array.from(document.querySelectorAll('.conEspacios'));
// Funcion que controla que calle y esquina no sean vacias, pero tambien permite espacios ==> "   " esta mal pero "  pedro  pedro" esta bien
const conEspacios = () => {
    noVaciosConEspacios.forEach((input) => {
        if(Array.from(input.value).some((caracter) => caracter != " ")){
            input.setCustomValidity("");
        } else {
            input.setCustomValidity("Caracteres invalidos");
        }
    });
}

//Funcion que controla que cada input numerico tenga su largo correcto ==> que no se ingresen numerso de mas o de menos
const nCorrecto = (id, minL, maxL) => {
    let num = document.getElementById(id);
    if(num.value.length === minL || num.value.length === maxL){
        num.setCustomValidity("");
    } else {
        num.setCustomValidity("Formato incorrecto");
    }
};

function crearUsuario(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let remember = document.getElementById("recordarme");

    let datosUsuario = {
        name : 'new User',
        secondName : null,
        surname: null,
        secondSurname: null,
        email: email,
        password: password,
        phone: null,
        img: null
    }
    
    localStorage.setItem("datosUser", JSON.stringify(datosUsuario));
    
    let compraE = localStorage.getItem("compraE");
    if( compraE != null){
        localStorage.removeItem("compraE");
    }
    if(!remember.checked){
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        remember.checked = false;
    }
}

const verificarInicioDeSesion = () => {
    let Usuario = JSON.parse(localStorage.getItem("datosUser"));
    let liPerfil = Array.from(document.getElementsByClassName("botonPerfil"));
    let liCerrar = Array.from(document.getElementsByClassName("botonCerrar"));
    
    if(Usuario == null){
        document.getElementById("emailLoginG").innerHTML = "Invitado";
        document.getElementById("emailLoginC").innerHTML = "Invitado";
        
        liPerfil.forEach(((liP) => {
            liP.innerHTML = `
                <button type="button" class="dropdown-item border aC" style="border-radius: 0.4em;" data-bs-toggle="modal" data-bs-target="#modalLogin">
                    Iniciar Sesión
                </button>

            `
        }))

        liCerrar.forEach(((liC) => {
            liC.innerHTML = "";
        }));

    } else {

        document.getElementById("emailLoginG").innerHTML = Usuario.name;
        document.getElementById("emailLoginC").innerHTML = Usuario.name;

        liPerfil.forEach(((liP) => {
            liP.innerHTML = `
                <a class="dropdown-item border aC" style="border-radius: 0.4em;" href="my-profile.html">Mi perfil</a>
            `
        }));

        liCerrar.forEach(((liC) => {
            liC.innerHTML = `
                <a class="dropdown-item border aC" style="border-radius: 0.4em;" href="#" onclick="cerrarS()">Cerrar sesión</a>
            `
        }));
    }
};

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function cerrarS(){
    localStorage.removeItem("datosUser");
    if(window.location.pathname === "/my-profile.html"){
        window.location = "index.html";
    }
    if(window.location.pathname === "/cart.html"){
        document.getElementById("botonFinalizarCompra").setAttribute("disabled", true);
    }
    verificarInicioDeSesion();
}

function setProductID(id) {
    localStorage.setItem("PID", id);
    window.location = "product-info.html"
}
  
if(window.location.pathname != "/my-profile.html"){
    document.getElementById("volverArriba").addEventListener("click", () => {
        window.location = "#";
    });
}

//Funciones para mostrar y modificar la tabla del carrito (paso de productinfo a cart)
function unirSubir(){
    let nuevoproducto = JSON.parse(localStorage.getItem("nuevoProducto")); //El objeto con la info del objeto a agregar

    carrito = JSON.parse(localStorage.getItem("carroCompras")); //Array con los diferentes objetos a comprar

    if(carrito === null){ //Si esta vacio se agrega directamente y se sube al LS
        carrito = [];
        carrito.push(nuevoproducto);
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        
        document.getElementById("alert-success").classList.add("show");
        setTimeout(function() {
            document.getElementById("alert-success").classList.remove("show");
        }, 3000);
        
    } else{ //Si ya hay productos y el nuevo aun no fue agregado
        let existe = carrito.find(({id}) => id === nuevoproducto.id);
        if(!existe){
            carrito.push(nuevoproducto);
            localStorage.setItem("carroCompras", JSON.stringify(carrito));
            
            document.getElementById("alert-success").classList.add("show");
            setTimeout(function() {
                document.getElementById("alert-success").classList.remove("show");
            }, 3000);
        }
    }
}