//Fncion que controla el modal del inicio de sesion
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

let inputNoVacio = Array.from(document.querySelectorAll('.sinEspacios'));

//Funciones de condicion para el modal de Inicio
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

        if (existeEmail != undefined && existePassW != undefined) {
            if (EPVacios(existeEmail.email) && EPVacios(existePassW.email)) {
                if (existeEmail.password === existePassW.password && existeEmail.email === existePassW.email) {
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
                } else {
                    if (existeEmail.password === existePassW.password) {
                        emailIngresado.setCustomValidity("Incorrecto");
                        passwordIngresada.setCustomValidity("");
                    } else if (existeEmail.email === existePassW.email) {
                        emailIngresado.setCustomValidity("Incorrecto");
                        passwordIngresada.setCustomValidity("");
                    } else {
                        emailIngresado.setCustomValidity("Incorrecto");
                        passwordIngresada.setCustomValidity("Incorrecto");
                    }
                }


            } else {
                emailIngresado.setCustomValidity("Incorrecto");
                passwordIngresada.setCustomValidity("Incorrecto");
            }


        } else {
            if (existeEmail != undefined) {
                if(emailCorrecto(emailIngresado)){
                    emailIngresado.setCustomValidity("");
                    passwordIngresada.setCustomValidity("Incorrecto");
                } else {
                    emailIngresado.setCustomValidity("Incorrecto");
                    passwordIngresada.setCustomValidity("Incorrecto");
                }
            } else if (existePassW != undefined) {
                emailIngresado.setCustomValidity("Incorrecto");
                passwordIngresada.setCustomValidity("");
            } else {
                if (EPVacios(emailIngresado.value) && EPVacios(passwordIngresada.value)) {
                    if(emailCorrecto(emailIngresado.value)){
                        emailIngresado.setCustomValidity("");
                        passwordIngresada.setCustomValidity("");
                        crearUsuario();
                    } else {
                        emailIngresado.setCustomValidity("");
                        passwordIngresada.setCustomValidity("Incorrecto");
                    }
                } else {
                    emailIngresado.setCustomValidity("Incorrecto");
                    passwordIngresada.setCustomValidity("Incorrecto");
                }
            }
        }

    } else {
        if (EPVacios(emailIngresado.value) && EPVacios(passwordIngresada.value)) {
            emailIngresado.setCustomValidity("");
            passwordIngresada.setCustomValidity("");
            crearUsuario();
        } else {
            emailIngresado.setCustomValidity("Incorrecto");
            passwordIngresada.setCustomValidity("Incorrecto");
        }
    }
};

const EPVacios = (input) => {
    return input.trim() !== "";
};

const emailCorrecto = (email) => {
    return email.includes("@");
};

const sinEspacios = () => {
    inputNoVacio.forEach((input) => {
        if (input.value.includes(" ")) {
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
        if (Array.from(input.value).some((caracter) => caracter != " ")) {
            input.setCustomValidity("");
        } else {
            input.setCustomValidity("Caracteres invalidos");
        }
    });
}

//Funcion que controla que cada input numerico tenga su largo correcto ==> que no se ingresen numerso de mas o de menos
const nCorrecto = (id, minL, maxL) => {
    let num = document.getElementById(id);
    if (num.value.length === minL || num.value.length === maxL) {
        num.setCustomValidity("");
    } else {
        num.setCustomValidity("Formato incorrecto");
    }
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function crearUsuario() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let datosUsuario = {
        id: Math.random(),
        name: 'User' + getRandomInt(1000000000),
        secondName: '',
        surname: '',
        secondSurname: '',
        email: email,
        password: password,
        phone: '',
        img: '',
        prefijadoBorrado: false,
        shop: {
            estado: false,
            cart: [],
            moneda: 'UYU'
        }
    }

    let registroUsuarios = JSON.parse(localStorage.getItem("registroUsuarios"));
    if (registroUsuarios) {
        registroUsuarios.push(datosUsuario);
    } else {
        registroUsuarios = [];
        registroUsuarios.push(datosUsuario);
    }

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

//Funcion que controla si el usuario esta o no ingresado para mostrar los elementos indicados
const verificarInicioDeSesion = () => {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    let liPerfil = Array.from(document.getElementsByClassName("botonPerfil"));
    let liCerrar = Array.from(document.getElementsByClassName("botonCerrar"));
    let liCarrito = Array.from(document.getElementsByClassName("botonCarrito"));


    if (!perfilIniciado) {
        document.getElementById("emailLoginG").innerHTML = "Invitado";
        document.getElementById("emailLoginC").innerHTML = "Invitado";

        liPerfil.forEach((liP) => {
            liP.innerHTML = `
                <button type="button" class="dropdown-item border aC" style="border-radius: 0.4em;" data-bs-toggle="modal" data-bs-target="#modalLogin">
                    Iniciar Sesión
                </button>

            `
        })

        liCerrar.forEach((liC) => {
            liC.innerHTML = "";
        });

        liCarrito.forEach((liCA) => {
            liCA.innerHTML = "";
        });

    } else {

        document.getElementById("emailLoginG").innerHTML = perfilIniciado.name;
        document.getElementById("emailLoginC").innerHTML = perfilIniciado.name;

        liPerfil.forEach((liP) => {
            liP.innerHTML = `
                <a class="dropdown-item border aC" style="border-radius: 0.4em;" href="my-profile.html">Mi perfil</a>
            `
        });

        liCerrar.forEach((liC) => {
            liC.innerHTML = `
                <a id="btnCerrar" class="dropdown-item border aC" style="border-radius: 0.4em;" href="#" onclick="cerrarS()">Cerrar sesión</a>
            `
        });

        liCarrito.forEach((liCA) => {
            liCA.innerHTML = `<a class="dropdown-item border aC" style="border-radius: 0.4em;" href="cart.html">Mi carrito</a>`;
        });
    }

    if (window.location.pathname === "/product-info.html") {
        chequearCarro();
        chequearComentario();
    }
};

//Funcion para cerrar sesion
function cerrarS() {
    localStorage.removeItem("perfilIniciado");
    if (window.location.pathname === "/my-profile.html" || window.location.pathname === "/cart.html") {
        window.location = "index.html";
    }
    verificarInicioDeSesion();
}

function setProductID(id) {
    localStorage.setItem("PID", id);
    window.location = "product-info.html"
}

if (window.location.pathname != "/my-profile.html") {
    document.getElementById("volverArriba").addEventListener("click", () => {
        window.location = "#";
    });
}

//Funcion lara actualizar el registro de perfiles
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
    comentariosPuestos.forEach((producto) => {
        let listaComentarios = producto.comentarios.map(comentario => comentario.user);
        let listaComentariosFiltrados = listaComentarios.filter((usuario) => usuario === usuarioActual);
        listaComentariosFiltrados.forEach((comment) => {
            let indexComentarioAModificar = producto.comentarios.map(comm => comm.user).indexOf(comment);
            producto.comentarios[indexComentarioAModificar].user = nuevoUsuario;
            localStorage.setItem("comentariosPuestos", JSON.stringify(comentariosPuestos));
        });
    });
};