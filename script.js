document.addEventListener("DOMContentLoaded", function () {

    const botonesCarrito = document.querySelectorAll(".carrito");
    const cartCount = document.getElementById("cart-count");
    const toast = document.getElementById("toast");
    const contactForm = document.getElementById("contact-form");

    const cartIcon = document.getElementById("cart-icon");
    const cartPanel = document.getElementById("cart-panel");
    const cartItems = document.getElementById("cart-items");
    const closeCart = document.getElementById("close-cart");
    const btnPagar = document.getElementById("btn-pagar");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    actualizarCarrito();

    // AGREGAR PRODUCTOS
    botonesCarrito.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            const producto = {
                nombre: this.dataset.nombre,
                precio: Number(this.dataset.precio),
                imagen: this.dataset.imagen
            };

            carrito.push(producto);
            guardarCarrito();

            actualizarCarrito();
            renderCarrito();
            mostrarToast(producto.nombre + " agregado al carrito");
        });
    });

    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function actualizarCarrito() {
        if (cartCount) {
            cartCount.textContent = carrito.length;
        }
    }

    function mostrarToast(mensaje) {
        if (!toast) return;

        toast.textContent = mensaje;
        toast.style.right = "20px";
        toast.style.opacity = "1";

        setTimeout(() => {
            toast.style.right = "-350px";
            toast.style.opacity = "0";
        }, 2500);
    }

    function renderCarrito() {
        if (!cartItems) return;

        const cartTotal = document.getElementById("cart-total");
        cartItems.innerHTML = "";

        if (carrito.length === 0) {
            cartItems.innerHTML = "<p>Tu carrito está vacío</p>";
            if (cartTotal) cartTotal.textContent = "0";
            return;
        }

        let total = 0;

        carrito.forEach((producto, index) => {
            total += producto.precio;

            cartItems.innerHTML += `
                <div class="cart-item">
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio.toLocaleString()}</p>
                    <button class="cart-delete" data-index="${index}">
                        Eliminar
                    </button>
                </div>
            `;
        });

        if (cartTotal) {
            cartTotal.textContent = total.toLocaleString();
        }

        // BOTONES ELIMINAR
        document.querySelectorAll(".cart-delete").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.dataset.index;
                carrito.splice(index, 1);
                guardarCarrito();
                actualizarCarrito();
                renderCarrito();
            });
        });
    }

    if (cartIcon) {
        cartIcon.addEventListener("click", function (e) {
            e.preventDefault();
            renderCarrito();
            cartPanel.classList.add("active");
        });
    }

    if (closeCart) {
        closeCart.addEventListener("click", function () {
            cartPanel.classList.remove("active");
        });
    }
   
    if (btnPagar) {
    btnPagar.addEventListener("click", function () {

        let total = carrito.reduce((suma, producto) => suma + producto.precio, 0);

        fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                carrito: carrito,
                total: total
            })
        })
        .then(res => res.json())
        .then(data => {
            alert("Pago procesado correctamente");
            console.log(data);
        })
        .catch(error => {
            console.log(error);
            alert("Error al procesar pago");
        });

    });
   }

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            mostrarToast("Mensaje enviado correctamente");
            contactForm.reset();
        });
    }
});