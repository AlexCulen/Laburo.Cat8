document.addEventListener("DOMContentLoaded", function() {
    let botonMenu = document.getElementById("boton_menu");
    let menu = document.getElementById("menu");
    let cerrarMenu = document.getElementById("close-btn");
    let presentacion = document.getElementById("presentacion");

    if (botonMenu && menu && cerrarMenu) { // Verifica que los elementos existen
        botonMenu.addEventListener("click", function() {
            menu.style.left = "0";
            botonMenu.style.left = "-300px"; // Muestra el menú
        });

        cerrarMenu.addEventListener("click", function() {
            menu.style.left = "-600px"; // Oculta el menú
            botonMenu.style.left = "20px";
        });
    } else {
        console.error("Uno o más elementos no se encontraron en el DOM.");
    }
});

submitButton.addEventListener("click", function(){
    const comment = commentInput.value;
    const commentElement = document.createElement("div");
    commentElement.innerHTML = comment;
    commentsContainer.appendChild(commentElement);
    commentInput.value = "";
});