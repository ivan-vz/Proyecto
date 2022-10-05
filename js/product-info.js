let productId = localStorage.getItem("PID"); // ID del producto al que entramos
const urlProductsInfo = "https://japceibal.github.io/emercado-api/products/"+ productId + ".json" // Link para poder entrar al product-info del producto especifico
const opiniones = "https://japceibal.github.io/emercado-api/products_comments/"+ productId + ".json"; // Link para obtener los comentarios
let lista = document.getElementById("contenedor");
let comentar = document.getElementById("enviar");
let producto = [];
let comment = [];
let estrellas;

//Funcion para conseguir los datos de un producto
document.addEventListener("DOMContentLoaded",async function(e){
    producto =  await getJSONData(urlProductsInfo); //Pedimos la informacion del producto
    showProductInfo(producto.data);
    comment =  await getJSONData(opiniones); //Pedimos los comentarios del producto

    //Guardamos en el localStorage los comentarios para poder mostrarlos
    if(JSON.parse(localStorage.getItem("ListaComentarios"+productId)) == null){
        localStorage.setItem("ListaComentarios"+productId, JSON.stringify(comment.data));
        showComments();
    } else {
        showComments();
    }
});

// Comentar
comentar.addEventListener("click",() => {
    let date = new Date();
    let nuevoCom = {
        "product": productId,
        "score": parseInt(document.getElementById("tuPuntuacion").value),
        "description": document.getElementById("tuOpinion").value,
        "user": infoUsuario.usuario, //variable creada en info.js
        "dateTime": date.toISOString().split('T')[0] + " " + date.toLocaleTimeString()
    }
    comment.data.unshift(nuevoCom);
    localStorage.setItem("ListaComentarios"+productId, JSON.stringify(comment.data));
    showComments();
})

//Funcion para mandar los comentarios fijos y nuevos al html
function showComments(){
    document.getElementById("Comentarios").innerHTML = ""; 
    let comments = JSON.parse(localStorage.getItem("ListaComentarios"+productId));
    comments.forEach(msj => {
        let k = 1;
        estrellas = "";
        let Us_Da = `<li class="list-group-item"><strong>${msj.user}</strong> - ${msj.dateTime} `;
        while (k < 6) {
            if(k <= parseInt(msj.score)){
                estrellas += `<span class="fa fa-star checked"></span>`;
            } else {
                estrellas += `<span class="fa fa-star"></span>`;
            }
            k++;
        }
        let Des = `<br>${msj.description}</li>`;
        document.getElementById("Comentarios").innerHTML += Us_Da + estrellas + Des; 
    });
}


//Funcion para mandar toda la informacion del producto al html
function showProductInfo(product){
    let datos = "";
    let imagenes = "";
    let objR = "";
    let pos = 0;

    if(!JSON.parse(localStorage.getItem("carroCompras")) || !(JSON.parse(localStorage.getItem("carroCompras")).find(({id}) => id === product.id))){
        document.getElementById("comprarProducto").removeAttribute("disabled");
        document.getElementById("cantComprar").removeAttribute("disabled");
    }

    document.getElementById("nameP").innerHTML = product.name;
    document.getElementById("costP").innerHTML = product.currency + product.cost;
    document.getElementById("descriptionP").innerHTML = product.description;
    document.getElementById("categoryP").innerHTML = product.category;
    document.getElementById("soldCountP").innerHTML = product.soldCount;

     for(imag of product.images){
        if(pos == 0){
            imagenes +=  
        `       
            <div class="carousel-item active">
                <img src="${imag}" class="d-block w-100 img-thumbnail">
            </div>
        `;
        } else {
            imagenes +=  
            `       
                <div class="carousel-item">
                    <img src="${imag}" class="d-block w-100 img-thumbnail">
                </div>
            `;
        }
        pos++;

        document.getElementById("galeriaCarousel").innerHTML = imagenes; 
    }

    for(prod of product.relatedProducts){
        objR += 
        `
        <div class="text-center">
            <img class="img-thumbnail" src="${prod.image}" onclick="setProductID(${prod.id})" style="width: 50%; cursor: pointer">
            <h6><small class="text-muted">${prod.name}</small></h6>
        </div>
        `
    }

    document.getElementById("ORelacionados").innerHTML = objR;
}


function crearNuevoProducto(){

    prod = producto.data;
    let pedidos = document.getElementById("cantComprar").value;

    if (pedidos != "" && pedidos > 0){
        let registro = {
            id: prod.id,
            name: prod.name,
            count: pedidos,
            currency: prod.currency,
            image: prod.images[0],
            unitCost: prod.cost
        }
        localStorage.setItem("nuevoProducto", JSON.stringify(registro));
      
        document.getElementById("comprarProducto").setAttribute("disabled", "");
        document.getElementById("cantComprar").setAttribute("disabled", "");

    }
}

//Botones para volver a productos  arriba
document.getElementById("volverProducts").addEventListener("click", () => {
    window.location = "products.html";
});