let productId = localStorage.getItem("PID");
const urlProductsInfo = PRODUCT_INFO_URL + productId + EXT_TYPE;
const opiniones = PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE;
let lista = document.getElementById("contenedor");
let producto = [];
let comment = [];
let estrellas;

//Funcion para conseguir los datos de un producto, inicializar y/o mostrar los comentarios, anular o no un boton
document.addEventListener("DOMContentLoaded",async function(e){
    verificarInicioDeSesion();

    google.accounts.id.initialize({
        client_id: "809127837215-6m5sscat51irktibf6mkd57gnv8s7r9v.apps.googleusercontent.com",
        callback: verificacionDeGoogleResponse,
        auto_select: true,
        auto: true
    });
    google.accounts.id.renderButton(
        document.getElementById("google-button"),
        { theme: "filled_blue", size: "medium", width: '200' }
    );
    
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    let comentariosPuestos = JSON.parse(localStorage.getItem("comentariosPuestos"));

    producto =  await getJSONData(urlProductsInfo);
    showProductInfo(producto.data);
    comment =  await getJSONData(opiniones);

    if(perfilIniciado) {

        let registroComentarios = {
            id: productId,
            comentarios: comment.data
        }

        if(comentariosPuestos){
            let existenComentarios = comentariosPuestos.find((producto) => {
                return (producto.id === productId);
            });
            
            if(!existenComentarios){
                comentariosPuestos.push(registroComentarios);
                localStorage.setItem('comentariosPuestos', JSON.stringify(comentariosPuestos));
            }
        } else {
            comentariosPuestos = [];
            comentariosPuestos.push(registroComentarios);
            localStorage.setItem('comentariosPuestos', JSON.stringify(comentariosPuestos));
        }
    }

    showComments();
    chequearCarro();
    chequearComentario();
});

//Funcion para mostrar la informacion del producto
function showProductInfo(product){
    
    let imagenes = "";
    let objR = "";
    let pos = 0;

    document.getElementById("nameP").innerHTML = product.name;
    document.getElementById("costP").innerHTML = product.currency + product.cost;
    document.getElementById("descriptionP").innerHTML = product.description;
    document.getElementById("categoryP").innerHTML = product.category;
    document.getElementById("soldCountP").innerHTML = product.soldCount;
    document.getElementById("namePChico").innerHTML = product.name;
    document.getElementById("costPChico").innerHTML = product.currency + product.cost;
    document.getElementById("descriptionPChico").innerHTML = product.description;
    document.getElementById("categoryPChico").innerHTML = product.category;
    document.getElementById("soldCountPChico").innerHTML = product.soldCount;

     for(imag of product.images){
        if(pos == 0){
            imagenes +=  
        `       
            <div class="carousel-item active">
                <img src="${imag}" alt="imgCarousel" class="d-block w-100 img-thumbnail">
            </div>
        `;
        } else {
            imagenes +=  
            `       
                <div class="carousel-item">
                    <img src="${imag}" alt="imgCarousel" class="d-block w-100 img-thumbnail">
                </div>
            `;
        }
        pos++;

        document.getElementById("galeriaCarousel").innerHTML = imagenes;
        document.getElementById("galeriaCarouselChica").innerHTML = imagenes;
    }

    for(prod of product.relatedProducts){
        objR += 
        `
        <div class="text-center">
            <img class="img-thumbnail" src="${prod.image}" alt="imgProd" onclick="setProductID(${prod.id})" style="width: 50%; cursor: pointer">
            <h6><small class="text-muted">${prod.name}</small></h6>
        </div>
        `
    }

    document.getElementById("ORelacionados").innerHTML = objR;
}

//Funcion para mostrar los comentarios
function showComments(){
    let comentariosAMostrar = [];
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    let comentariosPuestos = JSON.parse(localStorage.getItem("comentariosPuestos"));

    let indexAComentar = comentariosPuestos.map(object => object.id).indexOf(productId);
    comentariosAMostrar = comentariosPuestos[indexAComentar].comentarios;
    
    document.getElementById("Comentarios").innerHTML = ""; 
    
    comentariosAMostrar.forEach(msj => {
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

//Funcion para subir un comentario
comentar.addEventListener("click",() => {
    let date = new Date();
    let tuOpinion = document.getElementById("tuOpinion");
    
    if(tuOpinion.value.trim() != ""){
        let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
        let comentariosPuestos = JSON.parse(localStorage.getItem("comentariosPuestos"));
        let nuevoCom = {
            "product": productId,
            "score": parseInt(document.getElementById("tuPuntuacion").value),
            "description": tuOpinion.value,
            "user": perfilIniciado.name,
            "dateTime": date.toISOString().split('T')[0] + " " + date.toLocaleTimeString()
        }
    
        let indexAComentar = comentariosPuestos.map(object => object.id).indexOf(productId);
        comentariosPuestos[indexAComentar].comentarios.unshift(nuevoCom);
        localStorage.setItem('comentariosPuestos', JSON.stringify(comentariosPuestos));
        showComments();
        document.getElementById("tuPuntuacion").value = 1;
        tuOpinion.value = "";
    } else{
        document.getElementById("comentarioVacio").classList.add("show");
            setTimeout(function () {
                document.getElementById("comentarioVacio").classList.remove("show");
            }, 3000);
    }
})

//Funcion para agregar al carrito
function crearNuevoProducto(){

    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    prod = producto.data;
    let pedidos = document.getElementById("cantComprar");

    if (pedidos.value != "" && pedidos.value > 0){
        let registro = {
            id: prod.id,
            name: prod.name,
            count: pedidos.value,
            currency: prod.currency,
            image: prod.images[0],
            unitCost: prod.cost
        }
        perfilIniciado.shop.cart.push(registro);
        localStorage.setItem('perfilIniciado', JSON.stringify(perfilIniciado));
        actualizarRegistroPerfiles();
      
        pedidos.value = "";
        document.getElementById("comprarProducto").setAttribute("disabled", "");
        document.getElementById("cantComprar").setAttribute("disabled", "");

        document.getElementById("alert-success").classList.add("show");
            setTimeout(function () {
                document.getElementById("alert-success").classList.remove("show");
            }, 3000);
    } else {
        document.getElementById("alert-warning").classList.add("show");
        setTimeout(function() {
            document.getElementById("alert-warning").classList.remove("show");
        }, 3000);
    }
}

//Funcion qe controla el estado del boton y el input para "agregar productos"
let chequearCarro = () => {
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    if(perfilIniciado){
        let indexAComprar = perfilIniciado.shop.cart.map(producto => producto.id).indexOf(parseInt(productId));
        if(indexAComprar === -1){
            document.getElementById("comprarProducto").removeAttribute("disabled");
            document.getElementById("cantComprar").removeAttribute("disabled");
        } else {
            document.getElementById("comprarProducto").setAttribute("disabled", true);
            document.getElementById("cantComprar").setAttribute("disabled", true);
        }
    } else {
        document.getElementById("comprarProducto").setAttribute("disabled", true);
        document.getElementById("cantComprar").setAttribute("disabled", true);
    }
};

//Funcion que controla el boton de comentar segun el estado del usuario
let chequearComentario = () => {
    let comentar = document.getElementById("comentar");
    let perfilIniciado = JSON.parse(localStorage.getItem("perfilIniciado"));
    if(!perfilIniciado){
        comentar.setAttribute("disabled", true);
    } else {
        comentar.removeAttribute("disabled");
    }
};

//Botones para volver a productos
document.getElementById("volverProducts").addEventListener("click", () => {
    window.location = "products.html";
});