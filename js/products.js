let codigo = localStorage.getItem("catID"); //Guardamos el identificador de la categoria (subido al LS en categories.js) en una variable
const url = "https://japceibal.github.io/emercado-api/cats_products/" + codigo + ".json"; //Fucionamos la variable anterior con el URL para poder generar un enlace valido para pedir la informacion de cada categoria
let mercancia = [];
let newList = [];
let minCount;
let maxCount;

//Funcion para conseguir los datos
document.addEventListener("DOMContentLoaded",async function(e){
    mercancia =  await getJSONData(url);
    //localStorage.setItem("id", mercancia.data.products.id)
    showProductsList(mercancia.data.products);
    document.getElementById("tituloSecundario").innerHTML = `Verás aquí todos los productos de la categoría  ${mercancia.data.catName}`;
});

//función que recibe un array con los datos, y los muestra en pantalla a través el uso del DOM
function showProductsList(array){
    let htmlContentToAppend = "";

    for(let i = 0; i < array.length; i++){ 
     let product = array[i];
     htmlContentToAppend += `
     <div id="${product.name}" onclick="setProductID(${product.id})" class="list-group-item list-group-item-action cursor-active">
         <div class="row"> 
             <div class="col-3">
                 <img src="${product.image}" alt="product image" class="img-thumbnail"> 
             </div>
             <div class="col">
                 <div class="d-flex justify-content-between">
                     <div>
                     <h4>${product.name} - ${product.currency}${product.cost}</h4> 
                     <p> ${product.description}</p> 
                     </div>
                     <small class="text-muted">${product.soldCount} vendidos</small> 
                 </div>
             </div>
         </div>
     </div>
     `
     //class row genera una grilla de 12 columnas, en donde cada div representa una siendo class col-n la cantidad de espacio que ocupa (n/12)
     // class d-flex, w-100, justify-content-between, text-muted, mb-1 y img-thumbnail tiene asignadas caracteristicas en el css bootstrap
 }
      document.getElementById("Lista_De_Productos").innerHTML = htmlContentToAppend; 
}

// Funcion para guardar en el local storage la id de un producto especifico
function setProductID(id) {
    localStorage.setItem("PID", id);
    window.location = "product-info.html"
}

//Filtro

// Obtengo el boton de Filtrar por id y le agrego una accion al hacerle click
document.getElementById("rangeFilterCount").addEventListener("click", function(){
    minCount = document.getElementById("rangeFilterCountMin").value; // A la variable minCount le asigno el valor del input referente del valor minimo (idem con el maxcount)
    maxCount = document.getElementById("rangeFilterCountMax").value;

    // Si minCount tiene un valor asignado diferente al vacio y este tiene un integer (parseInt), entonces lo conservamos, de lo contrario lo desechamos
    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
        minCount = parseInt(minCount);
    }
    else{
        minCount = undefined;
    }
    // Idem que mincount
    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
        maxCount = parseInt(maxCount);
    }
    else{
        maxCount = undefined;
    }

    // Si ninguno tiene valores mostramos la lista completa, sino mostramos el resultado de hacer el filtrado (El cual es asignado al array newList)
    if ((minCount == undefined) && (maxCount == undefined)){     
        showProductsList(mercancia.data.products);
    } else {
        newList = mercancia.data.products.filter(entreMaxMin);
        showProductsList(newList);
    }
});

function entreMaxMin(prod){
    //Filtramos en los casos en que uno de los dos no tiene valor y cuando ambos tienen
    if(minCount == undefined){
        return (prod.cost <= maxCount);
    } else if (maxCount == undefined){
        return (prod.cost >= minCount);
    } else {
        return (prod.cost >= minCount) && (prod.cost <= maxCount);
    }
};

// Obtengo el boton de Limpiar por id y le agrego un accion al hacer click
document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterCountMin").value = ""; //Limpio los input del maximo y minimo
    document.getElementById("rangeFilterCountMax").value = "";

    minCount = undefined; //Reinicio las variables y los arrays utilizados
    maxCount = undefined;
    newList = [];

    showProductsList(mercancia.data.products); // Muestro todos los productos
});

//Orden
// Obtengo el boton para odenar de forma ascendente y le doy un evento, en el cual le doy a una funcion el codigo unico del boton y newList
document.getElementById("sortAsc").addEventListener("click", function(){
    sortAndShowProducts(1, newList);
});

// Idem que con sortAsc
document.getElementById("sortDesc").addEventListener("click", function(){
    sortAndShowProducts(2, newList);
});

// Idem que con sortAsc
document.getElementById("sortByCount").addEventListener("click", function(){
    sortAndShowProducts(3, newList);
});

function sortAndShowProducts(codEsp, arrayActual){
    // Si no se ha hecho ningun filtrado, mando a ordenar la lista base. De lo contrario mando la lista filtrada
    if(arrayActual.length == 0){
        newList = sortProducts(codEsp, mercancia.data.products);
    } else {
        newList = sortProducts(codEsp, arrayActual);
    }    
    showProductsList(newList);
}

// Dependiendo del codigo con el que se haya mandado se aplica un orden diferente (ascendiente, descendiente y po relevancia)
function sortProducts(codEsp, arrayActual){
    let result = [];
    if (codEsp === 1) //Ascendente
    {
        result = arrayActual.sort(function(a, b) {
            return b.cost - a.cost;
        });
    }else if (codEsp === 2) //Descendente
    {
        result = arrayActual.sort(function(a, b) {
            return a.cost - b.cost;
        });
    }else if (codEsp === 3) //Relevancia
    {
        result = arrayActual.sort(function(a, b) {
            return  b.soldCount - a.soldCount;
        });
    }
    return result;
}

//Buscador

function Fbuscador() {
    let input = document.getElementById("buscador").value.toLowerCase();// Obtengo y transformo en minuscula al valor ingresado en el input del buscador
    ListaBusc = []; //Reinicia la lista en cada busqueda

    if(newList.length == 0){ // Si no se a hecho ningun filtro utiliza la lista base de productos
        mercancia.data.products.forEach((merc) => {
            if(merc.name.toLowerCase().includes(input) || merc.description.toLowerCase().includes(input)){ //Verifica si lo que se ingreso en el input esta en el nombre (o descripcion) de los elementos del array
                ListaBusc.push(merc); //De estarlo lo agrega
            }
        });

        if(ListaBusc.length == 0){ // Si la lista esta vacia (se borro lo del input) se muestra la lista base
            showProductsList(mercancia.data.products);
        } else {
            showProductsList(ListaBusc); // De los contrario muestra lo encontrado
        }
    } else { //Si de relizo un filtrado (o se realiza posterior a la busqueda)
        newList.forEach((merc) => { //Idem que con mercancia
            if(merc.name.toLowerCase().includes(input) || merc.description.toLowerCase().includes(input)){ 
                ListaBusc.push(merc);
            }
        });
        if(ListaBusc.length == 0){
            showProductsList(newList);
        } else {
            showProductsList(ListaBusc);
        }
    }
}