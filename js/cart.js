const urlCarrito = CART_INFO_URL + "25801" + EXT_TYPE;

//Variables del carrito
let productoPrefijado;
let carrito;

//Variables del formulario
let inputsSinEspacios = Array.from(document.querySelectorAll('.form-control'));
let inputsConEspacios = Array.from(document.querySelectorAll('.conEspacios'));

let credito = document.getElementById("credito");
let nTarjeta = document.getElementById("nTarjeta");
let cSeguridad = document.getElementById("cSeguridad");
let fecha = document.getElementById("fecha");

let bancaria = document.getElementById("bancaria");
let nCuenta = document.getElementById("nCuenta");

let botonC = document.getElementById("botonCondiciones");

//Funcion para conseguir los datos de un producto, mostrarlos y ejecutar funciones dependiendo de los datos
document.addEventListener("DOMContentLoaded", async function (e) {
    verificarInicioDeSesion();
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));

    if (!perfilIniciado) {
        document.getElementById("botonFinalizarCompra").setAttribute("disabled", true);
    } else {
        if(perfilIniciado.shop.moneda === "USD"){
            document.getElementById("cambiarM").checked = true;
        } else {
            document.getElementById("cambiarM").checked = false;
        }
        productoPrefijado = await getJSONData(urlCarrito);
        productoPrefijado = productoPrefijado.data.articles[0];

        let indexProductoPrefijado = perfilIniciado.shop.cart.map(producto => producto.id).indexOf(productoPrefijado.id);

        if ((indexProductoPrefijado === -1) && (perfilIniciado.prefijadoBorrado === false)) {
            perfilIniciado.shop.cart.unshift(productoPrefijado);
            localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));
            actualizarRegistroPerfiles();
        }

        mostrarCarrito();

        if (perfilIniciado.shop.estado === true) {
            document.getElementById("compraE").classList.add("show");
            setTimeout(function () {
                document.getElementById("compraE").classList.remove("show");
            }, 3000);

            perfilIniciado.shop.estado = false;
            localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));
            actualizarRegistroPerfiles();
        }
    }
});

//Funcion que intercambia el valor de moneda segun el switch
function cambiarMoneda() {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));

    let switchMoneda = document.getElementById("cambiarM");
    monedaNueva = switchMoneda.checked
        ? "USD"
        : "UYU";

    perfilIniciado.shop.moneda = monedaNueva;
    localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));
    actualizarRegistroPerfiles();
    mostrarCarrito();
};

//Funcion para mostrar y/o convertir los datos en la pantalla
function mostrarCarrito() {
    let listaComprar = "";
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    if (perfilIniciado) {
        conversionYCuentas(perfilIniciado.shop);
        carrito = (JSON.parse(localStorage.getItem("perfilIniciado"))).shop.cart;

        carrito.forEach((compra) => {
            let subtotal = compra.unitCost * compra.count;
            listaComprar += `
            <tr>
                <th scope="row"><img src="${compra.image}" style="width: 5em" img-thumbnail></th>
                <td>${compra.name}</td>
                <td>${compra.currency}</td>
                <td>${ajustarCifras(compra.unitCost.toLocaleString())}</td>
                <td><input type="number" class="form-control border border-dark m-0" style="width: 4em;" id="subtotal${compra.id}" min="1" placeholder="${compra.count}" oninput="modificarCarrito(${compra.id})"></td>
                <td id="subtotalRelativo${compra.id}">${ajustarCifras(subtotal.toLocaleString())}</td>
                <td><img src="img/x-octagon.svg" style="width: 2em; cursor: pointer;" onclick="borrarProducto(${compra.id})"></td>
            </tr>
            `;
        });
    }

    document.getElementById("carritoProd").innerHTML = listaComprar;

    totalesAPagar();
}

//Funcion para modificar el subtotal de un item con el input en tiempo real
function modificarCarrito(idmodificar) {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    let indexProductoModificar = perfilIniciado.shop.cart.map(prod => prod.id).indexOf(idmodificar);

    let productoModificar = perfilIniciado.shop.cart[indexProductoModificar];

    let cant = document.getElementById("subtotal" + idmodificar).value;

    if (cant != "" && cant > 0) {
        document.getElementById("subtotal" + idmodificar).setAttribute("placeholder", cant);
        productoModificar.count = cant;

        let subtotal = productoModificar.count * productoModificar.unitCost;
        document.getElementById(`subtotalRelativo${productoModificar.id}`).innerHTML = ajustarCifras((subtotal).toLocaleString());
        actualizarProducto(productoModificar);
        totalesAPagar();
    }
}

//Funcion para pasar de dolares-pesos y viceversa
const conversionYCuentas = (compraCarrito) => {
    compraCarrito.cart.forEach((compra) => {
        let conversionProducto = {
            count: compra.count,
            currency: compraCarrito.moneda,
            id: compra.id,
            image: compra.image,
            name: compra.name,
            unitCost: ((compraCarrito.moneda === "USD" && compra.currency === "UYU")
                ? compra.unitCost /= 40
                : (compraCarrito.moneda === "UYU" && compra.currency === "USD")
                    ? compra.unitCost * 40
                    : compra.unitCost),
        };

        actualizarProducto(conversionProducto);
    });
};

//Funcion que calcula y muestra tanto el subtotal de toda la compra como su iva
const totalesAPagar = () => {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    if (perfilIniciado) {
        let premium = document.getElementById("premium");
        let express = document.getElementById("express");
        let standard = document.getElementById("standard");
        let ivaElegido = parseFloat(premium.checked
            ? premium.value
            : express.checked
                ? express.value
                : standard.value);
        let subC = 0;
        let ivaC = 0;

        let moneda = perfilIniciado.shop.moneda;
        carrito = perfilIniciado.shop.cart;

        if (carrito) {
            carrito.forEach((producto) => {
                subC += producto.count * producto.unitCost;
            });
        }

        ivaC = ivaElegido * subC;

        document.getElementById("subTC").innerHTML = moneda + ajustarCifras(subC.toLocaleString());
        document.getElementById("ivaC").innerHTML = moneda + ajustarCifras(ivaC.toLocaleString());
        document.getElementById("totalC").innerHTML = moneda + ajustarCifras((subC + ivaC).toLocaleString());
    }
};

//Funcion que modifica las cifras de los sbtotales, IVAS y totales con puntos, comas y dos cifras despues de la coma (si tiene)
function ajustarCifras(valorString) {
    let partesValor = valorString.split(",");
    let valorTot = [];
    let nuevoVal = [];

    valorTot.push(partesValor[0]);

    if (partesValor[1] != undefined) {
        let despuesComa = Array.from(partesValor[1]);
        nuevoVal.push(despuesComa[0]);
        if (despuesComa[1] != undefined) {
            nuevoVal.push(despuesComa[1]);
            nuevoVal = nuevoVal.join('');
        }

        valorTot.push(nuevoVal);
        valorTot = valorTot.join(",");
    }

    return valorTot;
};

//Funcion Bootstrap que cancela el subit en caso de no cumplir las condiciones
(() => {

    const forms = document.querySelectorAll('.valFinalizar-Compra')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();

                nTarjeta.setAttribute("oninput", "verificacionDelModalDePago()");
                cSeguridad.setAttribute("oninput", "verificacionDelModalDePago()");
                fecha.setAttribute("oninput", "verificacionDelModalDePago()");
                nCuenta.setAttribute("oninput", "verificacionDelModalDePago()");
                bancaria.setAttribute("onclick", "modalFormatoDePago(); mostrarErrorFormatoDePago();");
                credito.setAttribute("onclick", "modalFormatoDePago(); mostrarErrorFormatoDePago();");
                verificacionDelModalDePago();

            } else {
                let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
                perfilIniciado.shop.estado = true;
                localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));
                limpiarCarro();
                actualizarRegistroPerfiles();
            }

            form.classList.add('was-validated');

        }, false)
    })
})()

//Funcion que controla el estado del apartado del tipo de pago
const verificacionDelModalDePago = () => {

    if (!credito.checked && !bancaria.checked || !(nCuenta.checkValidity() || (cSeguridad.checkValidity() && fecha.checkValidity() && nTarjeta.checkValidity()))) {
        mostrarErrorFormatoDePago();

    } else {
        if (bancaria.checked) {
            mostrarErrorFormatoDePago();
            numeroCorrecto('nCuenta', 10, 10);

            if (nCuenta.checkValidity()) {
                esconderErrorFormatoDePago();
            }

        } else if (credito.checked) {
            mostrarErrorFormatoDePago();
            numeroCorrecto('cSeguridad', 3, 4);
            numeroCorrecto('nTarjeta', 16, 16);

            if (cSeguridad.checkValidity() && fecha.checkValidity() && nTarjeta.checkValidity()) {
                esconderErrorFormatoDePago();
            }
        }
    }
};

//Funcion que controla que cada input numerico tenga su largo correcto
const numeroCorrecto = (id, minL, maxL) => {
    let num = document.getElementById(id);
    if (num.value.length === minL || num.value.length === maxL) {
        num.setCustomValidity("");
    } else {
        num.setCustomValidity("Formato incorrecto");
    }
};

//Funcion que chequea Si fue seleccionada una forma de pago para habilitar sus opciones, bloquear las de la otra ademas de reiniciar sus valores
const modalFormatoDePago = () => {
    credito.checked
        ? (nCuenta.value = "",
            nTarjeta.removeAttribute("disabled"),
            cSeguridad.removeAttribute("disabled"),
            fecha.removeAttribute("disabled"),
            nCuenta.setAttribute("disabled", true))
        : (nTarjeta.value = "",
            cSeguridad.value = "",
            fecha.value = "",
            nCuenta.removeAttribute("disabled"),
            nTarjeta.setAttribute("disabled", true),
            cSeguridad.setAttribute("disabled", true),
            fecha.setAttribute("disabled", true));
};

//Funcion que se ejecuta cuando el apartado del tipo de pago esta validado
const esconderErrorFormatoDePago = () => {
    botonC.style.color = '#0d6efd';
    credito.setCustomValidity("");
    bancaria.setCustomValidity("");
    document.getElementById("selectT").classList.remove("d-block");
    document.getElementById("selectT").classList.add("d-none");
};

//Funcion que se ejecuta cuando el apartado del tipo de pago no esta validado
const mostrarErrorFormatoDePago = () => {
    botonC.style.color = '#dc3545';
    credito.setCustomValidity("Complete el form de pago");
    bancaria.setCustomValidity("Complete el form de pago");
    document.getElementById("selectT").classList.remove("d-none");
    document.getElementById("selectT").classList.add("d-block");
};

//Funcion que elimina un item del carro
const borrarProducto = (idEliminar) => {

    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));

    if ((idEliminar === 50924) && (perfilIniciado.prefijadoBorrado === false)) {
        perfilIniciado.prefijadoBorrado = true;
    }

    let indexProductoABorrar = perfilIniciado.shop.cart.map(producto => producto.id).indexOf(idEliminar);

    let prodEliminar = perfilIniciado.shop.cart[indexProductoABorrar];
    perfilIniciado.shop.cart.splice(prodEliminar, 1);

    localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));
    actualizarRegistroPerfiles();
    mostrarCarrito();
    totalesAPagar();
};

//Funcion para actualizar la informacion del usuario actual en el local storage
const actualizarProducto = (prod) => {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    let indexPerfilModificar = perfilIniciado.shop.cart.map(producto => producto.id).indexOf(prod.id);
    perfilIniciado.shop.cart[indexPerfilModificar] = prod;
    localStorage.setItem("perfilIniciado", JSON.stringify(perfilIniciado));
    actualizarRegistroPerfiles();
};

//Funcion que borra todos los productos comprados al terminar la compra
const limpiarCarro = () => {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    perfilIniciado.shop.cart.forEach((producto) => { borrarProducto(producto.id) });
};