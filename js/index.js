let datosUsuario;

//Alertas
function showAlertError1() {
    document.getElementById("alert-null").classList.add("show");
}
function showAlertError2() {
    document.getElementById("alert-email").classList.add("show");
}

//¿Ya ingresado?
let log = localStorage.getItem("datosUser");
if (log != null){
    window.location.href = "lobby.html";
} else {
//Funcion que genera un objeto con la informacion de un usuario
function arrayToObject(array){
    let newUser = {
        email: array[0].value,
        password: array[1].value,
        usuario: array[0].value.substring(0,array[0].value.indexOf("@")), //substring devuelve el string desde a hasta el caracter b de otro string, mientras que indexOf devuelve el indice del caracter buscado
    }
    return newUser;
}
//funcion que al clickear en login analiza los requisitos y las alarmas
document.getElementById("regBtn").addEventListener("click", (e) => {

    datosUsuario = arrayToObject(Array.from(document.querySelectorAll('input')));

    //localStorage
    localStorage.setItem("datosUser", JSON.stringify(datosUsuario));

    
    if (((datosUsuario.email != "" && datosUsuario.password != "")) && (datosUsuario.email.includes("@"))){
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        window.location.href = "lobby.html";
    } else {
        if (datosUsuario.email == "" || datosUsuario.password == ""){
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