const urlCarrito = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
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
    carrito = JSON.parse(localStorage.getItem("carroCompras"));
    let listaComprar = "";
    carrito.forEach(compra => {
        let subtotal = compra.count * compra.unitCost;
        listaComprar += `
        <tr>
            <th scope="row"><img src="${compra.image}" style="width: 5em" img-thumbnail></th>
            <td>${compra.name}</td>
            <td>${compra.currency}${compra.unitCost}</td>
            <td><input type="number" class="form-control border border-dark" style="width: 4em;" id="subtotal${compra.id}" min="1" placeholder="${compra.count}" oninput="modificarCarrito(${compra.id})"></td>
            <td id="subtotalRelativo${compra.id}">${compra.currency}${subtotal}</td>
            <td><img src="img/x-octagon.svg" style="width: 50%; cursor: pointer;" onclick="borrar(${compra.id})"></td>
        </tr>
        `;
    });
    document.getElementById("carritoProd").innerHTML = listaComprar;
}


function modificarCarrito(idmodificar){
    let productoModificar = carrito.find(({id}) => id === idmodificar); //Encontrams el producto en carrito
    let cant = document.getElementById("subtotal" + idmodificar).value; //Conseguimos la nueva cantidad

    //Si es un valor coherente 
    if (cant != "" && cant > 0){
        document.getElementById("subtotal" + idmodificar).setAttribute("placeholder", cant); //Modificamos el placeholder con la nueva cantidad
        productoModificar.count = cant; //Modificamos la cantidad en el objeto
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        let subtotal = productoModificar.count * productoModificar.unitCost; //Calculamos el nuevo subtotal
        document.getElementById(`subtotalRelativo${productoModificar.id}`).innerHTML = `$${subtotal}`; //Actualizamos la tabla con el nuevo subtotal
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

    if(carrito) {
        carrito.forEach(compra => {
            let dolares = compra.unitCost;
            if(compra.currency === "UYU"){
                dolares = pesosADolares(compra.unitCost);
            }
            subC += dolares * compra.count;
            ivaC += ivaElegido * (dolares * compra.count);
        }); 
    }
    document.getElementById("subTC").innerHTML = "USD " + subC.toFixed(2);
    document.getElementById("ivaC").innerHTML = "USD " + ivaC.toFixed(2);
    document.getElementById("totalC").innerHTML = "USD " + (subC + ivaC).toFixed(2);
};

const pesosADolares = (monto) => {
    return (monto / 41,22).toFixed(2); //Dolar el 18/10/22
};

const Fpago = () => {
   let tCredito = document.getElementById("credito");

   tCredito.checked
   ? (document.getElementById("nTarjeta").removeAttribute("disabled"),
     document.getElementById("cSeguridad").removeAttribute("disabled"),
     document.getElementById("fecha").removeAttribute("disabled"),
     document.getElementById("nCuenta").setAttribute("disabled", true))
   : (document.getElementById("nCuenta").removeAttribute("disabled"),
     document.getElementById("nTarjeta").setAttribute("disabled", true),
     document.getElementById("cSeguridad").setAttribute("disabled", true),
     document.getElementById("fecha").setAttribute("disabled", true));
};

/* -------------------------------------------------------------------------------------------------------------------------------------------------- */

let inputs = Array.from(document.querySelectorAll('.form-control'));

(() => {
  
    const form1 = document.getElementById("form1");
    const form2 = document.getElementById("form2");

    form1.addEventListener('submit', event => {
        if (!form1.checkValidity() && !form2.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        } else {
            localStorage.setItem("compraE", 'true');
        }

        form1.classList.add('was-validated');
        form2.classList.add('was-validated');
        seAcepto();
      }, false)
  })()

const esVacio = () => {
    inputs.forEach((input) => {
        if(input.value.includes(" ")){
            input.setCustomValidity("Caracteres invalidos");
        } else {
            input.setCustomValidity("");
        }
    })
};

const nCorrecto = (id, minL, maxL) => {
    let num = document.getElementById(id);
    if(num.value.length === minL || num.value.length === maxL){
        num.setCustomValidity("");
    } else {
        num.setCustomValidity("Formato incorrecto");
    }
};

const seAcepto = () => {
    let credito = document.getElementById("credito");
    let bancaria = document.getElementById("bancaria"); 

    let botonC = document.getElementById("botonCondiciones");

    console.log(credito, bancaria, botonC);
    if(credito.checked || bancaria.checked){
        botonC.style.color = '#0d6efd';
        credito.setCustomValidity("");
        bancaria.setCustomValidity("");
        document.getElementById("selectT").classList.remove("d-inline-block");
        document.getElementById("selectT").classList.add("d-none");
    } else {
        botonC.style.color = '#dc3545';
        credito.setCustomValidity("Seleccione una trasferencia");
        credito.setCustomValidity("Seleccione una trasferencia");
        document.getElementById("selectT").classList.remove("d-none");
        document.getElementById("selectT").classList.add("d-inline-block");
    }
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