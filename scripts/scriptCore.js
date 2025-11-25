document.addEventListener("DOMContentLoaded", () => {
    const toggleThemeBtn = document.getElementById("toggleTheme");
    const menuBtn = document.getElementById("menu-btn");
    const menuList = document.getElementById("menu-list");

  // === Tema oscuro / claro ===
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") document.body.classList.add("light");

    toggleThemeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");
        localStorage.setItem("theme",
            document.body.classList.contains("light") ? "light" : "dark"
        );
    });

  // === Menú responsive ===
    menuBtn.addEventListener("click", () => {
        menuList.classList.toggle("show");
    });

  // === Cerrar menú al seleccionar una sección ===
    menuList.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
            menuList.classList.remove("show");
        });
    });
});
