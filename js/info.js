//Funciones globales 

//Inicio con google

function handleCredentialResponse(response) {
    let googleButton = document.getElementById('google-button');
    const responsePayload = decodeJwtResponse(response.credential);

    let registroUsuarios = JSON.parse(localStorage.getItem("registroUsuarios"));

    if (registroUsuarios) {
        let indexPerfilYaExistente = registroUsuarios.map(perfil => perfil.email).indexOf(responsePayload.email);
        if(indexPerfilYaExistente){
            let perfilIniciado = registroUsuarios[indexPerfilYaExistente];
            localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));
            verificarInicioDeSesion();
            const toastInicioExitoso = document.getElementById('inicioExitoso');
            const toastIE = new bootstrap.Toast(toastInicioExitoso)

            toastIE.show()
            setTimeout(function () {
                toastIE.hide();
            }, 3000);
        } else {
            crearUsuario(responsePayload.email, null, responsePayload.name, responsePayload.picture);
        }
    } else {
        crearUsuario(responsePayload.email, null, responsePayload.name, responsePayload.picture);
    }

    verificarInicioDeSesion();
}


// function to decode the response.credential
function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

//Funcion que controla el modal del inicio de sesion
(() => {
    const forms = Array.from(document.querySelectorAll('.validacionLogin'));

    forms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');

            if (form.checkValidity()) {
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                form.classList.remove('was-validated');
                document.getElementById("closeB").click();
            }

        }, false)
    })
})()

//Funciones de condicion para el modal de Inicio
//Valida si el email y la contraseña estan libres, ya existen y coinciden con un usuario, ademas de no ser vacios y tener el formato correcto
let cuentaCorrectaOLibre = () => {
    let emailIngresado = document.getElementById("email");
    let passwordIngresada = document.getElementById("password");

    let registroUsuarios = JSON.parse(localStorage.getItem("registroUsuarios"));

    if (registroUsuarios) {
        let existeEmail = registroUsuarios.find((usuario) => {
            return (usuario.email === emailIngresado.value);
        });

        let existePassW = registroUsuarios.find((usuario) => {
            return (usuario.password === passwordIngresada.value);
        });

        if ((existeEmail != undefined && existePassW != undefined) && (existeEmail.password === existePassW.password && existeEmail.email === existePassW.email)) {
            emailIngresado.setCustomValidity("");
            passwordIngresada.setCustomValidity("");
            let perfilIniciado = existeEmail;
            localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));
            verificarInicioDeSesion();
            const toastInicioExitoso = document.getElementById('inicioExitoso');
            const toastIE = new bootstrap.Toast(toastInicioExitoso)

            toastIE.show()
            setTimeout(function () {
                toastIE.hide();
            }, 3000);
        } else if ((existeEmail === undefined && existePassW === undefined) && (formatoEPCorrecto(emailIngresado.value, passwordIngresada.value))) {
            emailIngresado.setCustomValidity("");
            passwordIngresada.setCustomValidity("");
            crearUsuario(emailIngresado.value, emailIngresado.value, null, null);
        } else {
            emailIngresado.setCustomValidity("Incorrecto");
            passwordIngresada.setCustomValidity("Incorrecto");
        }

    } else {
        if (formatoEPCorrecto(emailIngresado.value, passwordIngresada.value)) {
            emailIngresado.setCustomValidity("");
            passwordIngresada.setCustomValidity("");
            crearUsuario(emailIngresado.value, emailIngresado.value, null, null);
        } else {
            emailIngresado.setCustomValidity("Incorrecto");
            passwordIngresada.setCustomValidity("Incorrecto");
        }
    }
};

//Email y contraseña no vacios, email con "@" y contraseña con minimo 6 caracteres
const formatoEPCorrecto = (email, passw) => {
    return ((email.trim() !== "") && (passw.trim().length > 5) && (email.includes("@")));
}

//Condiciones para el modal de compra y el de perfil
//Funcion que no permite campos totalmente nulos
const conEspacios = () => {
    let noVaciosConEspacios = Array.from(document.querySelectorAll('.conEspacios'));
    noVaciosConEspacios.forEach((input) => {
        if (Array.from(input.value).some((caracter) => caracter != " ")) {
            input.setCustomValidity("");
        } else {
            input.setCustomValidity("Caracteres invalidos");
        }
    });
}

//Funcion que crea y sube al registro un nuevo usuario
function crearUsuario(emailNuevo, passwNuevo, nameNuevo, photoNuevo) {
    let datosUsuario = {
        id: Math.random(),
        name: nameNuevo === null
            ?  'User' + getRandomInt(1000000000)
            : nameNuevo,
        secondName: '',
        surname: '',
        secondSurname: '',
        email: emailNuevo,
        password: passwNuevo,
        phone: '',
        img: photoNuevo,
        prefijadoBorrado: false,
        shop: {
            estado: false,
            cart: [],
            moneda: 'UYU'
        }
    }

    let registroUsuarios = JSON.parse(localStorage.getItem("registroUsuarios"));
    if (!registroUsuarios) {
        registroUsuarios = [];
    }
    registroUsuarios.push(datosUsuario);

    let perfilIniciado = datosUsuario;
    localStorage.setItem("registroUsuarios", JSON.stringify(registroUsuarios));
    localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));

    const toastCreacionCuenta = document.getElementById('nuevaCuentaCreada');
    const toastCC = new bootstrap.Toast(toastCreacionCuenta)

    toastCC.show()
    setTimeout(function () {
        toastCC.hide();
    }, 3000);

    verificarInicioDeSesion();

}

//Funcion que retorna un valor random
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//Funcion que controla si el usuario esta o no ingresado para mostrar los elementos indicados
const verificarInicioDeSesion = () => {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    let liCerrar = Array.from(document.getElementsByClassName("botonCerrar"));
    let liCarrito = Array.from(document.getElementsByClassName("botonCarrito"));


    if (!perfilIniciado) {
        document.getElementById("emailLoginG").innerHTML = "Invitado";
        document.getElementById("emailLoginC").innerHTML = "Invitado";

        if (!window.location.pathname.includes("/my-profile.html") || !window.location.pathname.includes("/cart.html")) {
            let liPerfil = Array.from(document.getElementsByClassName("botonPerfil"));
            liPerfil.forEach((liP) => {
                liP.innerHTML = `
                    <button type="button" class="dropdown-item border aC" style="border-radius: 0.4em;" data-bs-toggle="modal" data-bs-target="#modalLogin">
                        Iniciar Sesión
                    </button>
    
                `
            })
        }

        liCerrar.forEach((liC) => {
            liC.innerHTML = "";
        });

        liCarrito.forEach((liCA) => {
            liCA.innerHTML = "";
        });

    } else {

        document.getElementById("emailLoginG").innerHTML = perfilIniciado.name;
        document.getElementById("emailLoginC").innerHTML = perfilIniciado.name;

        if (!window.location.pathname.includes("/my-profile.html")) {
            let liPerfil = Array.from(document.getElementsByClassName("botonPerfil"));
            liPerfil.forEach((liP) => {
                liP.innerHTML = `
                    <a class="dropdown-item border aC" style="border-radius: 0.4em;" href="my-profile.html">Mi perfil</a>
                `
            });
        }

        liCerrar.forEach((liC) => {
            liC.innerHTML = `
                <a id="btnCerrar" class="dropdown-item border aC" style="border-radius: 0.4em;" href="#" onclick="cerrarS()">Cerrar sesión</a>
            `
        });

        liCarrito.forEach((liCA) => {
            liCA.innerHTML = `<a class="dropdown-item border aC" style="border-radius: 0.4em;" href="cart.html">Mi carrito</a>`;
        });
    }

    if (window.location.pathname.includes("/product-info.html")) {
        chequearCarro();
        chequearComentario();
    }
};

//Funcion para actualizar el registro de perfiles
const actualizarRegistroPerfiles = () => {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    let registroUsuarios = JSON.parse(localStorage.getItem("registroUsuarios"));

    if (registroUsuarios) {
        let indexPerfilModificar = registroUsuarios.map(perfil => perfil.id).indexOf(perfilIniciado.id);
        registroUsuarios[indexPerfilModificar] = perfilIniciado;
        localStorage.setItem("registroUsuarios", JSON.stringify(registroUsuarios));
    }
};

//Funcion para actualizar la informacion de un comentario al editar el perfil
const modificarDatosComentarios = (usuarioActual, nuevoUsuario) => {
    let comentariosPuestos = JSON.parse(localStorage.getItem("comentariosPuestos"));
    if (comentariosPuestos) {
        comentariosPuestos.forEach((producto) => {
            let listaComentarios = producto.comentarios.map(comentario => comentario.user);
            if (listaComentarios) {
                let listaComentariosFiltrados = listaComentarios.filter((usuario) => usuario === usuarioActual);
                listaComentariosFiltrados.forEach((comment) => {
                    let indexComentarioAModificar = producto.comentarios.map(comm => comm.user).indexOf(comment);
                    producto.comentarios[indexComentarioAModificar].user = nuevoUsuario;
                    localStorage.setItem("comentariosPuestos", JSON.stringify(comentariosPuestos));
                });
            }
        });
    }
};

//Funcion para cerrar sesion
function cerrarS() {
    localStorage.removeItem("perfilIniciado");
    google.accounts.id.disableAutoSelect();
    if (window.location.pathname.includes("/my-profile.html") || window.location.pathname.includes("/cart.html")) {
        window.location = "index.html";
    }
    verificarInicioDeSesion();
}

function setProductID(id) {
    localStorage.setItem("PID", id);
    window.location = "product-info.html"
}