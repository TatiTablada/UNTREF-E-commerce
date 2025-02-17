document.addEventListener("DOMContentLoaded", () => {
    let productos = [];

    fetch("./data/productos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            productos = data;
            if (document.querySelector("#contenedor-productos")) {
                cargarProductos(productos);
            }
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });

    // Selección de elementos del DOM
    const contenedorProductos = document.querySelector("#contenedor-productos");
    const botonesCategorias = document.querySelectorAll(".boton-categoria");
    const tituloPrincipal = document.querySelector("#titulo-principal");
    const numerito = document.querySelector("#numerito");
    const paginaProducto = document.querySelector(".pagina-producto");
    const atras = document.querySelector("#atras");

    // Verificar si el contenedor de productos existe
    if (contenedorProductos) {
        // Función para cargar los productos en el contenedor
        function cargarProductos(productos) {
            contenedorProductos.innerHTML = productos.map(producto => `
                <div class="producto">
                    <img class="producto-imagen" data-product-id="${producto.id}" src="${producto.imagen}" alt="${producto.titulo}" onerror="this.onerror=null;this.src='./multimedia/adidas-superstar.jpg';">
                    <div class="producto-detalles">
                        <h3 class="producto-titulo">${producto.titulo}</h3>
                        <p class="producto-precio">$${producto.precio}</p>
                        <button class="producto-agregar" id="${producto.id}"><i class="fa-solid fa-cart-shopping"></i> Agregar</button>
                    </div>
                </div>
            `).join('');

            actualizarBotonesAgregar();
            mostrarDetalles();
        }

        // Función para actualizar los botones de agregar al carrito
        function actualizarBotonesAgregar() {
            document.querySelectorAll(".producto-agregar").forEach(boton => {
                boton.addEventListener("click", agregarAlCarrito);
            });
        }

        let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
        actualizarNumerito();

        // Función para agregar productos al carrito
        function agregarAlCarrito(e) {
            Toastify({
                text: "Producto agregado",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#ff5733",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem",
                },
                offset: {
                    x: '1.5rem',
                    y: '1.5rem'
                },
                onClick: function () { }
            }).showToast();

            const idBoton = e.currentTarget.id;
            const productoAgregado = productos.find(producto => producto.id === idBoton);

            const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idBoton);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                productoAgregado.cantidad = 1;
                productosEnCarrito.push(productoAgregado);
            }

            actualizarNumerito();
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        }

        // Función para actualizar el número de productos en el carrito
        function actualizarNumerito() {
            if (!numerito) {
                console.error("El elemento numerito no se encontró.");
                return;
            }

            numerito.innerText = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        }

        // Función para mostrar los detalles de un producto
        function mostrarDetalles() {
            document.querySelectorAll(".producto-imagen").forEach(figure => {
                figure.addEventListener("click", () => {
                    const productId = figure.getAttribute("data-product-id");
                    const producto = productos.find(p => p.id == productId);

                    if (producto) {
                        tituloPrincipal.innerText = producto.titulo;
                        contenedorProductos.classList.add("disabled");
                        paginaProducto.classList.remove("disabled");
                        atras.classList.remove("disabled");
                        paginaProducto.innerHTML = `
                            <article>
                                <img class="imagen-detalle" src="${producto.imagen}" alt="">
                                <p class="detalle-precio">$${producto.precio}</p>
                                <p class="detalle-descripcion">${producto.descripcion}</p>
                                <button class="producto-agregar" id="${producto.id}"><i class="fa-solid fa-cart-shopping"></i> Agregar</button>
                            </article>
                        `;
                        actualizarBotonesAgregar();
                    } else {
                        console.error(`No se encontró el producto con id: ${productId}`);
                    }
                });
            });
        }

        // Event listener para los botones de categorías
        botonesCategorias.forEach(boton => {
            boton.addEventListener("click", (e) => {
                botonesCategorias.forEach(boton => boton.classList.remove("active"));
                e.currentTarget.classList.add("active");

                const categoriaId = e.currentTarget.id;
                if (categoriaId !== "todos") {
                    const productosFiltrados = productos.filter(producto => producto.categoria.id === categoriaId);
                    tituloPrincipal.innerText = productosFiltrados[0]?.categoria.nombre || "Categoría";
                    cargarProductos(productosFiltrados);
                } else {
                    tituloPrincipal.innerText = "Todos los productos";
                    cargarProductos(productos);
                }
            });
        });

        // Event listener para el botón de atrás
        if (atras) {
            atras.addEventListener("click", () => {
                contenedorProductos.classList.remove("disabled");
                paginaProducto.classList.add("disabled");
                atras.classList.add("disabled");
                tituloPrincipal.innerText = "Todos los productos";
            });
        }
    }
});