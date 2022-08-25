let codigo = localStorage.getItem("catID"); 
const url = "https://japceibal.github.io/emercado-api/cats_products/" + codigo + ".json";
let mercancia = [];
let newList = [];
let minCount;
let maxCount;

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

//Funcion para conseguir los datos
document.addEventListener("DOMContentLoaded",async function(e){
    mercancia =  await getJSONData(url);
    //console.log(mercancia.data.products);
    showCategoriesList(mercancia.data.products);
});

//Filtro

function entreMaxMin(prod){
    if(minCount == undefined){
        return (prod.cost <= maxCount);
    } else if (maxCount == undefined){
        return (prod.cost >= minCount);
    } else {
        return (prod.cost >= minCount) && (prod.cost <= maxCount);
    }
};

document.getElementById("rangeFilterCount").addEventListener("click", function(){
    minCount = document.getElementById("rangeFilterCountMin").value;
    maxCount = document.getElementById("rangeFilterCountMax").value;

    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
        minCount = parseInt(minCount);
    }
    else{
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
        maxCount = parseInt(maxCount);
    }
    else{
        maxCount = undefined;
    }

    if ((minCount == undefined) && (maxCount == undefined)){
        showCategoriesList(mercancia.data.products);
    } else {
        newList = mercancia.data.products.filter(entreMaxMin);
        showCategoriesList(newList);
    }
});

document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";

    minCount = undefined;
    maxCount = undefined;
    newList = [];

    showCategoriesList(mercancia.data.products);
});

//Orden
document.getElementById("sortAsc").addEventListener("click", function(){
    sortAndShowCategories(1, newList);
});

document.getElementById("sortDesc").addEventListener("click", function(){
    sortAndShowCategories(2, newList);
});

document.getElementById("sortByCount").addEventListener("click", function(){
    sortAndShowCategories(3, newList);
});

function sortAndShowCategories(sortCriteria, categoriesArray){
    if(categoriesArray.length == 0){
        console.log(mercancia.data.products);
        newList = sortCategories(sortCriteria, mercancia.data.products);
    } else {
        newList = sortCategories(sortCriteria, categoriesArray);
    }
    //console.log(newList);
    
    showCategoriesList(newList);
}

function sortCategories(criteria, array){
    let result = [];
    //console.log(criteria);
    //console.log(array);
    if (criteria === 1) //Ascendente
    {
        result = array.sort(function(a, b) {
            return b.cost - a.cost;
        });
    }else if (criteria === 2) //Descendente
    {
        result = array.sort(function(a, b) {
            return a.cost - b.cost;
        });
    }else if (criteria === 3) //Relevancia
    {
        result = array.sort(function(a, b) {
            return  b.soldCount - a.soldCount;
        });
    }
    //console.log(result);
    return result;
}