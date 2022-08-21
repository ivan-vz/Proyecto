
//(function...)() es una funcon de ejecucion inmediate, se ejecuta tan pronto se define   

//Chequea contenido
function showAlertError1() {
    document.getElementById("alert-null").classList.add("show");
}
function showAlertError2() {
    document.getElementById("alert-email").classList.add("show");
}

function noVacios(dato0, dato1){

    if ((dato0 === "") || (dato1 === "")){
        return false;
    } else {
        return true;
    }
}

//email
function emailCorrecto(correo){
    if (correo.includes("@")) {
        return true;
    } else {
        return false;
    }
}

//Guardar inputs
document.getElementById("regBtn").addEventListener("click", (e) => {

    let datos = document.querySelectorAll('input');

    if ((noVacios(datos[0].value, datos[1].value)) && (emailCorrecto(datos[0].value))){
        for(let dato of datos){
            dato.value = "";
            dato.checked = false;
        }
        window.location.href = "inicio.html";
    } else {
        if (!(noVacios(datos[0].value, datos[1].value))){
            showAlertError1();
            setTimeout(function() {
                document.getElementById("alert-null").classList.remove("show");
            }, 3000);
        } else {
            showAlertError2();
            setTimeout(function() {
                document.getElementById("alert-email").classList.remove("show");
            }, 3000);
        }
    }
})