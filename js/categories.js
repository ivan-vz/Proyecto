//Variables

//Ordenes
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";

//Arrays y valores
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

//Filtros
let filtroCGrande = document.getElementById("rangeFilterCategoriesGrande");
let filtroCChico = document.getElementById("rangeFilterCategoriesChico");
let limpiarCGrande = document.getElementById("clearRangeFilterCategoriesGrande");
let limpiarCChico = document.getElementById("clearRangeFilterCategoriesChico");

//Input Filtros
let cantMinGrande = document.getElementById("rangeMinCategoriesGrande");
let cantMaxGrande = document.getElementById("rangeMaxCategoriesGrande");
let cantMinChica = document.getElementById("rangeMinCategoriesChico");
let cantMaxChica = document.getElementById("rangeMaxCategoriesChico");

document.addEventListener("DOMContentLoaded", function(e){
    verificarInicioDeSesion();
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data
            showCategoriesList()
        }
    });
});

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div class="row row-cols justify-content-center" id="${category.id}">
                <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active d-none d-lg-block d-md-block">
                    <div class="row">
                        <div class="col-3">
                            <img src="${category.imgSrc}" alt="categoryPhoto" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">${category.name}</h4>
                                <small class="text-muted">${category.productCount} artículos</small>
                            </div>
                            <p class="mb-1">${category.description}</p>
                        </div>
                    </div>
                </div>

                <div class="card cursor-active d-sm-block d-lg-none d-md-none my-2" style="width: 18rem;" onclick="setCatID(${category.id})">
                    <img class="card-img-top" src="${category.imgSrc}" alt="product image">
                    <div class="card-body">
                        <h5 class="card-title">${category.name}</h5>
                        <p class="card-text">${category.description}</p>
                        <small class="text-muted">${category.productCount} vendidos</small>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    showCategoriesList();
}

filtroCGrande.addEventListener("click", () => {
    minCount = cantMinGrande.value;
    maxCount = cantMaxGrande.value;
    rangeFilerCategories()
});

filtroCChico.addEventListener("click", () => {
    minCount = cantMinChica.value;
    maxCount = cantMaxChica.value;
    rangeFilerCategories()
});

limpiarCGrande.addEventListener("click", () => {limpiar()});

limpiarCChico.addEventListener("click", () => {limpiar()});

const rangeFilerCategories = () => {

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

    showCategoriesList();
};

const limpiar = () => {
    cantMinGrande.value = "";
    cantMaxGrande.value = "";
    cantMinChica.value = "";
    cantMaxChica.value = "";

    minCount = undefined;
    maxCount = undefined;

    showCategoriesList();
};

document.getElementById("sortAsc").addEventListener("click", function(){
    sortAndShowCategories(ORDER_ASC_BY_NAME);
});

document.getElementById("sortDesc").addEventListener("click", function(){
    sortAndShowCategories(ORDER_DESC_BY_NAME);
});

document.getElementById("sortByCount").addEventListener("click", function(){
    sortAndShowCategories(ORDER_BY_PROD_COUNT);
});