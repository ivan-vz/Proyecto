const urlCarrito = CART_INFO_URL + "25801" + EXT_TYPE;
//Variables del carrito
let productoBase;
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

//Funcion para conseguir los datos de un producto
document.addEventListener("DOMContentLoaded",async function(e){
    verificarInicioDeSesion();
    let Usuario = JSON.parse(localStorage.getItem("datosUser"));
    if(Usuario == null){
        document.getElementById("botonFinalizarCompra").setAttribute("disabled", true);
    }

    productoBase =  await getJSONData(urlCarrito);
    carrito = JSON.parse(localStorage.getItem("carroCompras"));
    let borrado = localStorage.getItem("borrado");

    if(!carrito && (!borrado || borrado != 'true')){
        carrito = productoBase.data.articles;
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        
    } else {
        
        let existe = carrito.find(({id}) => id === productoBase.data.articles[0].id);
        if(!existe && (!borrado || borrado != 'true')){
            carrito.unshift(productoBase.data.articles[0]);
            localStorage.setItem("carroCompras", JSON.stringify(carrito));
        }
    }

    //Creacion inicial de "moneda"
    let monedaActual = localStorage.getItem("moneda");
    if(!monedaActual){
        localStorage.setItem("moneda", "UYU");
    }

    mostrarCarrito();
    totales();

    //Mensaje de compra exitosa
    let compraE = localStorage.getItem("compraE"); 
    console.log(typeof compraE, compraE);
    if(compraE != null && compraE !="false"){
        document.getElementById("compraE").classList.add("show");
        setTimeout(function() {
        document.getElementById("compraE").classList.remove("show");
        }, 3000);
        localStorage.setItem("compraE", 'false');
    }

});


function mostrarCarrito(){
    let moneda = localStorage.getItem("moneda");
    carrito = JSON.parse(localStorage.getItem("carroCompras"));
    let listaComprar = "";
    carrito.forEach(compra => {
        let conversionCompra = {
            count: compra.count,
            currency: moneda === "USD"
                    ? "USD"
                    : "UYU",
            id: compra.id,
            image: compra.image,
            name: compra.name,
            unitCost: ((moneda === "USD" && compra.currency === "UYU")
                    ? compra.unitCost /= 40
                    : (moneda === "UYU" && compra.currency === "USD")
                    ? compra.unitCost * 40
                    : compra.unitCost)
        };

        let  subtotal = conversionCompra.count * conversionCompra.unitCost;
        listaComprar += `
        <tr>
            <th scope="row"><img src="${conversionCompra.image}" style="width: 5em" img-thumbnail></th>
            <td>${conversionCompra.name}</td>
            <td>${conversionCompra.currency}</td>
            <td>${ajustarCifras(conversionCompra.unitCost.toLocaleString())}</td>
            <td><input type="number" class="form-control border border-dark" style="width: 4em;" id="subtotal${conversionCompra.id}" min="1" placeholder="${conversionCompra.count}" oninput="modificarCarrito(${compra.id})"></td>
            <td id="subtotalRelativo${conversionCompra.id}">${ajustarCifras(subtotal.toLocaleString())}</td>
            <td><img src="img/x-octagon.svg" style="width: 2em; cursor: pointer;" onclick="borrar(${conversionCompra.id})"></td>
        </tr>
        `;
    });
    document.getElementById("carritoProd").innerHTML = listaComprar;

    totales();
}

//Funcion para modificar el subtotal de un item con el input en tiempo real
function modificarCarrito(idmodificar){
    let productoModificar = carrito.find(({id}) => id === idmodificar);
    let cant = document.getElementById("subtotal" + idmodificar).value;
    let moneda = localStorage.getItem("moneda");

    let nuevoValor = (moneda === "USD" && productoModificar.currency === "UYU")
                    ? productoModificar.unitCost / 40
                    : (moneda === "UYU" && productoModificar.currency === "USD")
                    ? productoModificar.unitCost * 40
                    : productoModificar.unitCost;

    if (cant != "" && cant > 0){
        document.getElementById("subtotal" + idmodificar).setAttribute("placeholder", cant);
        productoModificar.count = cant;
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        let subtotal = productoModificar.count * nuevoValor; 
        document.getElementById(`subtotalRelativo${productoModificar.id}`).innerHTML = moneda + ajustarCifras((subtotal).toLocaleString());
        totales();
    }
}

//Funcion que calcula y muestra tanto el subtotal de toda la compra como su iva
const totales = () => {
    carrito = JSON.parse(localStorage.getItem("carroCompras"));
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

    let moneda = localStorage.getItem("moneda");

    if(carrito) {
        carrito.forEach(compra => {        
            let conversionCompra = {
                count: compra.count,
                currency: moneda === "USD"
                        ? "USD"
                        : "UYU",
                unitCost: ((moneda === "USD" && compra.currency === "UYU")
                        ? compra.unitCost / 40
                        : (moneda === "UYU" && compra.currency === "USD")
                        ? compra.unitCost * 40
                        : compra.unitCost)
            };

            subC += conversionCompra.count * conversionCompra.unitCost
            }); 
    }

    ivaC = ivaElegido * subC;
    
    document.getElementById("subTC").innerHTML = moneda + ajustarCifras(subC.toLocaleString());
    document.getElementById("ivaC").innerHTML = moneda + ajustarCifras(ivaC.toLocaleString());
    document.getElementById("totalC").innerHTML = moneda + ajustarCifras((subC + ivaC).toLocaleString());
};

//Funcion que chequea Si fue seleccionada una forma de pago para habilitar sus opciones, bloquear las de la otra ademas de reiniciar sus valores
const Fpago = () => {
   credito.checked
   ? ( nCuenta.value = "",
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

//Funcion Bootstrap que cancela el subit en caso de no cumplir las condiciones
(() => {
    
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if(!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();

            nTarjeta.setAttribute("oninput", "seAcepto()");
            cSeguridad.setAttribute("oninput", "seAcepto()");
            fecha.setAttribute("oninput", "seAcepto()");
            nCuenta.setAttribute("oninput", "seAcepto()");
            bancaria.setAttribute("onclick", "Fpago(); mostrar();");
            credito.setAttribute("onclick", "Fpago(); mostrar();");
            seAcepto();
        } else {
            localStorage.setItem("compraE", "true");
        }
  
        form.classList.add('was-validated');

      }, false)
    })
})()

//Funcion que controla el estado del apartado del tipo de pago
const seAcepto = () => {

    if(!credito.checked && !bancaria.checked || !(nCuenta.checkValidity() || (cSeguridad.checkValidity() && fecha.checkValidity() && nTarjeta.checkValidity()))){
        mostrar();

    } else {
        if(bancaria.checked){
            mostrar();
            nCorrecto('nCuenta',10, 10);

            if(nCuenta.checkValidity()){
                esconder();
            }

        } else if (credito.checked ){
            mostrar();
            nCorrecto('cSeguridad',3, 4);
            nCorrecto('nTarjeta',16, 16);

            if(cSeguridad.checkValidity() && fecha.checkValidity() && nTarjeta.checkValidity()){
                esconder();
            }
        }
    }
};

//Funcion que se ejecuta cuando el apartado del tipo de pago esta validado
const esconder = () => {
    botonC.style.color = '#0d6efd';
    credito.setCustomValidity("");
    bancaria.setCustomValidity("");
    document.getElementById("selectT").classList.remove("d-block");
    document.getElementById("selectT").classList.add("d-none");
};

//Funcion que se ejecuta cuando el apartado del tipo de pago no esta validado
const mostrar = () => {
    botonC.style.color = '#dc3545';
    credito.setCustomValidity("Complete el form de pago");
    bancaria.setCustomValidity("Complete el form de pago");
    document.getElementById("selectT").classList.remove("d-none");
    document.getElementById("selectT").classList.add("d-block");
};

  /* -------------------------------------------------------------------------------------------------------------------------------------------------- */
  
  //Funcion que elimina un item del carro
  const borrar = (idEliminar) => {

    let borrado = localStorage.getItem("borrado");
    if(idEliminar === 50924 && !borrado){
        localStorage.setItem('borrado', 'true');
    }
    carrito = JSON.parse(localStorage.getItem("carroCompras"));
    let obEliminar = carrito.find(({id}) => id === idEliminar);
    let indx = carrito.indexOf(obEliminar);
    carrito.splice(indx, 1);
    localStorage.setItem("carroCompras", JSON.stringify(carrito));
    mostrarCarrito();
    totales();
  };

  //Funcion que intercambia el valor de moneda segun el switch
  function cambiarMoneda() {
    let switchMoneda = document.getElementById("cambiarM");
    monedaNueva = switchMoneda.checked
                ? "USD"
                : "UYU";

    localStorage.setItem("moneda", monedaNueva);

    mostrarCarrito();
  };

  //Funcion que modifica las cifras de los sbtotales, IVAS y totales con puntos, comas y dos cifras despues de la coma (si tiene)
  function ajustarCifras(valorString){
    let partesValor = valorString.split(",");
    let valorTot = [];
    let nuevoVal = [];

    valorTot.push(partesValor[0]);

    if(partesValor[1] != undefined){
        let despuesComa = Array.from(partesValor[1]);
        nuevoVal.push(despuesComa[0]);
        if(despuesComa[1] != undefined){
            nuevoVal.push(despuesComa[1]);
            nuevoVal = nuevoVal.join('');
        }

        valorTot.push(nuevoVal);
        valorTot = valorTot.join(",");
    }
    
    return valorTot;
  };