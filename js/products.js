const url = "https://japceibal.github.io/emercado-api/cats_products/101.json";

 //array donde se cargarán los datos recibidos:
let categoriesArray = [];

//función que recibe un array con los datos, y los muestra en pantalla a través el uso del DOM
function showCategoriesList(array){
    let htmlContentToAppend = "";

    for(let i = 0; i < array.length; i++){ 
     let category = array[i];
     htmlContentToAppend += `
     <div>
         <div class="row"> 
             <div class="col-3">
                 <img src="` + category.image + `" alt="product image" class="img-thumbnail"> 
             </div>
             <div class="col">
                 <div class="d-flex justify-content-between">
                     <div>
                     <h4>`+ category.name + ' - ' + category.currency + category.cost +`</h4> 
                     <p> `+ category.description +`</p> 
                     </div>
                     <small class="text-muted">` + category.soldCount + ` vendidos</small> 
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

document.addEventListener("DOMContentLoaded",async function(e){
    let autos =  await getJSONData(url);
    console.log(autos.data.products);
    showCategoriesList(autos.data.products);
});