document.addEventListener("DOMContentLoaded", function(){
    verificarInicioDeSesion();
    
    google.accounts.id.initialize({
        client_id: "809127837215-6m5sscat51irktibf6mkd57gnv8s7r9v.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
        auto: true
    });
    
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});