const urlCarrito = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
let productoBase;

//Funcion para conseguir los datos de un producto
document.addEventListener("DOMContentLoaded",async function(e){
    productoBase =  await getJSONData(urlCarrito);
    let carrito = JSON.parse(localStorage.getItem("carroCompras"));

    // Si el carrito esta vacio lo declaramos como el array con el producto prefijado 
    if(!carrito){
        carrito = productoBase.data.articles;
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
        
    // Si ya tiene productos, entonces le agregamos el prefijado al inicio del array
    } else {
        
        let existe = carrito.find(({id}) => id === productoBase.data.articles[0].id);
        if(!existe){
            carrito.unshift(productoBase.data.articles[0]);
            localStorage.setItem("carroCompras", JSON.stringify(carrito));
        }
    }

    mostrarCarrito();
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
    }
}