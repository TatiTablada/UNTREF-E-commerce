document.addEventListener("DOMContentLoaded", () => {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
    const contenedorCarritoProductos = document.querySelector("#carrito-productos");
    const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
    const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
    const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
    const contenedorTotal = document.querySelector("#total");
    const botonComprar = document.querySelector("#carrito-acciones-comprar");
    const contenedorCarrito = document.querySelector("#contenedor-carrito");


    if (!contenedorCarrito) {
        console.error("El contenedor del carrito no se encontró.");
        return;
    }

    function cargarProductosCarrito() {
        if (productosEnCarrito.length > 0) {
            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.remove("disabled");
            contenedorCarritoAcciones.classList.remove("disabled");
            contenedorCarritoComprado.classList.add("disabled");

            contenedorCarrito.innerHTML = productosEnCarrito.map(producto => `
                <div class="producto-carrito">
                    <img src="${producto.imagen}" alt="${producto.titulo}">
                    <div class="producto-detalles">
                        <h3>${producto.titulo}</h3>
                        <p>$${producto.precio}</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                        <button class="producto-eliminar" data-id="${producto.id}">Eliminar</button>
                    </div>
                </div>
            `).join('');
        } else {
            contenedorCarritoVacio.classList.remove("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.add("disabled");
        }

        actualizarBotonesEliminar();
        actualizarTotal();
    }

    function actualizarBotonesEliminar() {
        const botonesEliminar = document.querySelectorAll(".producto-eliminar");
        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", eliminarDelCarrito);
        });
    }

    function eliminarDelCarrito(e) {
        const idProducto = e.currentTarget.dataset.id;
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idProducto);
        cargarProductosCarrito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }

    function vaciarCarrito() {
        Swal.fire({
            title: '¿Estás seguro?',
            icon: 'warning',
            html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
            showCancelButton: true,
            confirmButtonColor: '#3085d1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar todo'
        }).then((result) => {
            if (result.isConfirmed) {
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                cargarProductosCarrito();
            }
        });
    }

    function actualizarTotal() {
        const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        contenedorTotal.innerText = `$${totalCalculado}`;
    }

    function comprarCarrito() {
        productosEnCarrito.length = 0;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");
    }

    if (botonVaciar) {
        botonVaciar.addEventListener("click", vaciarCarrito);
    }

    if (botonComprar) {
        botonComprar.addEventListener("click", comprarCarrito);
    }

    cargarProductosCarrito();
});

