const urlCarrito = CART_INFO_URL + "25801" + EXT_TYPE;
let productoBase;
let carrito;

//Funcion para conseguir los datos de un producto
document.addEventListener("DOMContentLoaded",async function(e){
    productoBase =  await getJSONData(urlCarrito);
    carrito = JSON.parse(localStorage.getItem("carroCompras"));
    let borrado = localStorage.getItem("borrado");
    // Si el carrito esta vacio lo declaramos como el array con el producto prefijado 
    if(!carrito && (!borrado || borrado != 'true')){
        carrito = productoBase.data.articles;
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        
    // Si ya tiene productos, entonces le agregamos el prefijado al inicio del array
    } else {
        
        let existe = carrito.find(({id}) => id === productoBase.data.articles[0].id);
        if(!existe && (!borrado || borrado != 'true')){
            carrito.unshift(productoBase.data.articles[0]);
            localStorage.setItem("carroCompras", JSON.stringify(carrito));
        }
    }

    let monedaActual = localStorage.getItem("moeda");
    if(!monedaActual){
        localStorage.setItem("moneda", "UYU");
    }

    mostrarCarrito();
    totales();

    let compraE = localStorage.getItem("compraE"); 
    if(compraE && compraE != 'false'){
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

        let  subtotal = conversionCompra.count * (conversionCompra.unitCost).toFixed(2);
        listaComprar += `
        <tr>
            <th scope="row"><img src="${conversionCompra.image}" style="width: 5em" img-thumbnail></th>
            <td>${conversionCompra.name}</td>
            <td>${conversionCompra.currency}${conversionCompra.unitCost.toLocaleString()}</td>
            <td><input type="number" class="form-control border border-dark" style="width: 4em;" id="subtotal${conversionCompra.id}" min="1" placeholder="${conversionCompra.count}" oninput="modificarCarrito(${compra.id})"></td>
            <td id="subtotalRelativo${conversionCompra.id}">${conversionCompra.currency}${subtotal.toLocaleString()}</td>
            <td><img src="img/x-octagon.svg" style="width: 50%; cursor: pointer;" onclick="borrar(${conversionCompra.id})"></td>
        </tr>
        `;
    });
    document.getElementById("carritoProd").innerHTML = listaComprar;

    totales();
}


function modificarCarrito(idmodificar){
    let productoModificar = carrito.find(({id}) => id === idmodificar); //Encontrams el producto en carrito
    let cant = document.getElementById("subtotal" + idmodificar).value; //Conseguimos la nueva cantidad
    let moneda = localStorage.getItem("moneda");

    let nuevoValor = ((moneda === "USD" && productoModificar.currency === "UYU")
                    ? productoModificar.unitCost /= 40
                    : (moneda === "UYU" && productoModificar.currency === "USD")
                    ? productoModificar.unitCost * 40
                    : productoModificar.unitCost).toFixed(2);

    //Si es un valor coherente 
    if (cant != "" && cant > 0){
        document.getElementById("subtotal" + idmodificar).setAttribute("placeholder", cant); //Modificamos el placeholder con la nueva cantidad
        productoModificar.count = cant; //Modificamos la cantidad en el objeto
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        let subtotal = productoModificar.count * nuevoValor; //Calculamos el nuevo subtotal
        document.getElementById(`subtotalRelativo${productoModificar.id}`).innerHTML = moneda + subtotal; //Actualizamos la tabla con el nuevo subtotal
        totales();
    }
}

const totales = () => {
    carrito = carrito = JSON.parse(localStorage.getItem("carroCompras"));
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
                unitCost: (moneda === "USD" && compra.currency === "UYU")
                        ? compra.unitCost /= 40
                        : (moneda === "UYU" && compra.currency === "USD")
                        ? compra.unitCost * 40
                        : compra.unitCost
            };

            subC += conversionCompra.count * conversionCompra.unitCost
            }); 
    }

    ivaC = ivaElegido * subC;
    
    document.getElementById("subTC").innerHTML = moneda + subC.toLocaleString();
    document.getElementById("ivaC").innerHTML = moneda + ivaC.toLocaleString();
    document.getElementById("totalC").innerHTML = moneda + (subC + ivaC).toLocaleString();
};

const Fpago = () => {
    let credito = document.getElementById("credito");
    let nTarjeta = document.getElementById("nTarjeta");
    let cSeguridad = document.getElementById("cSeguridad");
    let fecha = document.getElementById("fecha");

    let nCuenta = document.getElementById("nCuenta");

   credito.checked
   ? ( nCuenta.value = " ",
     mostrar(),
     nTarjeta.removeAttribute("disabled"),
     cSeguridad.removeAttribute("disabled"),
     fecha.removeAttribute("disabled"),
     nCuenta.setAttribute("disabled", true))
   : (nTarjeta.value = " ",
     cSeguridad.value = " ",
     fecha.value = " ",
     mostrar(),
     nCuenta.removeAttribute("disabled"),
     nTarjeta.setAttribute("disabled", true),
     cSeguridad.setAttribute("disabled", true),
     fecha.setAttribute("disabled", true));
};

  (() => {
    
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();

            document.getElementById("nTarjeta").setAttribute("oninput", "seAcepto()");
            document.getElementById("cSeguridad").setAttribute("oninput", "seAcepto()");
            document.getElementById("fecha").setAttribute("oninput", "seAcepto()");
            document.getElementById("nCuenta").setAttribute("oninput", "seAcepto()");
            seAcepto();
        } else {
            localStorage.setItem("compraE", 'true');
        }
  
        form.classList.add('was-validated');
        seAcepto();

      }, false)
    })
  })()


let inputsSinEspacios = Array.from(document.querySelectorAll('.form-control'));
let inputsConEspacios = Array.from(document.querySelectorAll('.conEspacios'));

// Funcion que controla que calle y esquina no sean vacias, pero tambien permite espacios ==> "   " esta mal pero "  pedro  pedro" esta bien
const conEspacios = () => {
    inputsConEspacios.forEach((input) => {
        if(Array.from(input.value).some((caracter) => caracter != " ")){
            input.setCustomValidity("");
        } else {
            input.setCustomValidity("Caracteres invalidos");
        }
    });
}

//Funcion que controla que los input numericos no sean vacios
const esVacio = () => {
    inputsSinEspacios.forEach((input) => {
        if(input.value.includes(" ")){
            input.setCustomValidity("Caracteres invalidos");
        } else {
            input.setCustomValidity("");
        }
    });
};

//Funcion que controla que cada input numerico tenga su largo correcto ==> que no se ingresen numerso de mas o de menos
const nCorrecto = (id, minL, maxL) => {
    let num = document.getElementById(id);
    if(num.value.length === minL || num.value.length === maxL){
        num.setCustomValidity("");
    } else {
        num.setCustomValidity("Formato incorrecto");
    }
};

//Funcion que controla el estado del formulario de pago
let credito = document.getElementById("credito");
let nTarjeta = document.getElementById("nTarjeta");
let cSeguridad = document.getElementById("cSeguridad");
let fecha = document.getElementById("fecha");

let bancaria = document.getElementById("bancaria"); 
let nCuenta = document.getElementById("nCuenta");

let botonC = document.getElementById("botonCondiciones");

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

const esconder = () => {
    botonC.style.color = '#0d6efd';
    credito.setCustomValidity("");
    bancaria.setCustomValidity("");
    document.getElementById("selectT").classList.remove("d-block");
    document.getElementById("selectT").classList.add("d-none");
};

const mostrar = () => {
    botonC.style.color = '#dc3545';
    credito.setCustomValidity("Complete el form de pago");
    bancaria.setCustomValidity("Complete el form de pago");
    document.getElementById("selectT").classList.remove("d-none");
    document.getElementById("selectT").classList.add("d-block");
};

  /* -------------------------------------------------------------------------------------------------------------------------------------------------- */
  
  const borrar = (idEliminar) => {

    let borrado = localStorage.getItem("borrado");
    if(idEliminar === 50924 && !borrado){
        localStorage.setItem('borrado', 'true');
    }
    carrito = carrito = JSON.parse(localStorage.getItem("carroCompras"));
    let obEiminar = carrito.find(({id}) => id === idEliminar);
    let indx = carrito.indexOf(obEiminar);
    carrito.splice(indx, 1);
    localStorage.setItem("carroCompras", JSON.stringify(carrito));
    mostrarCarrito();
    totales();
  };

  function cambiarMoneda() {
    let switchMoneda = document.getElementById("cambiarM");
    monedaNueva = switchMoneda.checked
                ? "USD"
                : "UYU";

    localStorage.setItem("moneda", monedaNueva);

    mostrarCarrito();
  };