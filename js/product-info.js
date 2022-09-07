let productId = localStorage.getItem("PID"); // ID del producto al que entrmos
const urlProductsInfo = "https://japceibal.github.io/emercado-api/products/"+ productId + ".json" // Link para poder entrar al product-info del producto especifico
const opiniones = "https://japceibal.github.io/emercado-api/products_comments/"+ productId + ".json";
let producto = [];
let comment = [];
let i = 0;
let j = 0;

//Funcion para conseguir los datos de un producto
document.addEventListener("DOMContentLoaded",async function(e){
    producto =  await getJSONData(urlProductsInfo);
    showProductInfo(producto.data);
    comment =  await getJSONData(opiniones);

    if(JSON.parse(localStorage.getItem("ListaComentarios"+productId)) == null){
        localStorage.setItem("ListaComentarios"+productId, JSON.stringify(comment.data));
        showComments();
    } else {
        showComments();
    }
});

function showComments(){
    document.getElementById("Comentarios").innerHTML = ""; 
    let comments = JSON.parse(localStorage.getItem("ListaComentarios"+productId));
    let estrellas;
    comments.forEach(element => {
        let Us_Da = `<li class="list-group-item"><strong>${element.user}</strong> - ${element.dateTime} `;
        switch (element.score){
            case 1: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>

            `
            break;

            case 2: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>

            `
            break;

            case 3: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>

            `
            break;

            case 4: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>

            `
            break;

            case 5: estrellas = `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>

            `
            break;
        }
        let Des = `<br>${element.description}</li>`;
        document.getElementById("Comentarios").innerHTML += Us_Da + estrellas + Des; 
    });
}

function showProductInfo(product){
    let datos = "";
    let imagenes = ""
    datos = `
        <div class="col-12 align-self-center">
            <div>
                <div>
                    <h2>${product.name}</h2><br>
                <hr><br>
                    <h4>Precio</h4><br>
                    <p>${product.currency} ${product.cost}</p><br>
                    <h4>Descripción</h4><br>
                    <p> ${product.description}</p><br>
                    <h4>Categoría</h4><br>
                    <p> ${product.category}</p><br>
                    <h4>Cantidad de vendidos</h4><br>
                    <p> ${product.soldCount}</p><br>
                    <h4>Imagenes Ilustrativas</h4><br>
                </div>
            </div>
        </div>
     `

        imagenes +=  `       
            <a class="col-3" href="#foto1"><img src="${product.images[0]}" alt="product image" class="img-thumbnail"></a>
            <a class="col-3" href="#foto2"><img src="${product.images[1]}" alt="product image" class="img-thumbnail"></a>
            <a class="col-3" href="#foto3"><img src="${product.images[2]}" alt="product image" class="img-thumbnail"></a>
            <a class="col-3" href="#foto4"><img src="${product.images[3]}" alt="product image" class="img-thumbnail"></a>


            <div id="foto1" class="modal">
                <div class="imagen">
                    <a href="#foto4">&#60;</a>
                    <a href="#foto2"><img src="${product.images[0]}" alt="img 1"></a>
                    <a href="#foto2">></a>
                </div>
                <a class="cerrar" href="#catalogo">X</a>
                <!-- como el href de "cerrar" esta vacio nos devuelve a la misma ruta sacandole el final lo que genera un efecto de boton -->
            </div>

            <div id="foto2" class="modal">
                <div class="imagen">
                    <a href="#foto1">&#60;</a>
                    <a href="#foto3"><img src="${product.images[1]}" alt="img 2"></a>
                    <a href="#foto3">></a>
                </div>
                <a class="cerrar" href="#catalogo">X</a>
            </div>

            <div id="foto3" class="modal">
                <div class="imagen">
                    <a href="#foto2">&#60;</a>
                    <a href="#foto4"><img src="${product.images[2]}" alt="img 3"></a>
                    <a href="#foto4">></a>
                </div>
                <a class="cerrar" href="#catalogo">X</a>
            </div>

            <div id="foto4" class="modal">
                <div class="imagen">
                    <a href="#foto3">&#60;</a>
                    <a href="#foto1"><img src="${product.images[3]}" alt="img 4"></a>
                    <a href="#foto1">></a>
                </div>
                <a class="cerrar" href="#catalogo">X</a>
            </div>
     `;

      document.getElementById("informacion").innerHTML = datos; 
      document.getElementById("galeria").innerHTML = imagenes; 

}

// Comentar
let lista = document.getElementById("contenedor");
let comentar = document.getElementById("enviar");

comentar.addEventListener("click",() => {
    let date = new Date();
    let nuevoCom = {
        "product": productId,
        "score": parseInt(document.getElementById("tuPuntuacion").value),
        "description": document.getElementById("tuOpinion").value,
        "user": "Usuario",
        "dateTime": date.toISOString().split('T')[0] + " " + date.toLocaleTimeString()
    }
    j++;
    comment.data.unshift(nuevoCom);
    localStorage.setItem("ListaComentarios"+productId, JSON.stringify(comment.data));
    showComments();
})