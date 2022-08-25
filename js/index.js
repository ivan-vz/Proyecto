//Alertas
function showAlertError1() {
    document.getElementById("alert-null").classList.add("show");
}
function showAlertError2() {
    document.getElementById("alert-email").classList.add("show");
}

//Condiciones
function noVacios(dato0, dato1){

    if ((dato0 === "") || (dato1 === "")){
        return false;
    } else {
        return true;
    }
}
function emailCorrecto(correo){
    if (correo.includes("@")) {
        return true;
    } else {
        return false;
    }
}

//¿Ya ingresado?
let log = localStorage.getItem("email");
if (log != null){
    window.location.href = "inicio.html";
} else {

//funcion que al clickear en login analiza los requisitos y las alarmas
document.getElementById("regBtn").addEventListener("click", (e) => {

    let datos = document.querySelectorAll('input');

    //localStorage
    localStorage.setItem("email", datos[0].value);
    
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
}