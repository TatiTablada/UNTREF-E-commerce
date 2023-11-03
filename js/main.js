let productos = [];

fetch("https://run.mocky.io/v3/87457c19-3567-4a27-8f5d-8bbf0d5cd64a")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
const paginaProducto = document.querySelector(".pagina-producto")


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" data-product-id="${producto.id}" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}"><i class="fa-solid fa-cart-shopping"></i> Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
    mostrarDetalles();
}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: " #ff5733",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem",
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
          },
        onClick: function(){} 
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


function mostrarDetalles() {
    const figures = document.querySelectorAll("img");

    figures.forEach((figure) => {
        figure.addEventListener("click", () => {
            const productId = figure.getAttribute("data-product-id"); 

            const producto = productos.find((p) => p.id == productId);

            if (producto) {
                tituloPrincipal.innerText= `${producto.titulo}`
                contenedorProductos.classList.add("disabled")
                paginaProducto.classList.remove("disabled")
                atras.classList.remove("disabled")
                paginaProducto.innerHTML = `
                <article>
                    <img class="imagen-detalle" src="${producto.imagen}" alt="">
                    <p class="detalle-precio">$${producto.precio}</p>
                    <p class="detalle-descripcion">${producto.descripcion}</p>
                    <button class="producto-agregar" id="${producto.id}"><i class="fa-solid fa-cart-shopping"></i> Agregar</button>
                    </article> 
                `
            } else {
                console.error(`No se encontró el producto con id: ${productId}`);
            }

            actualizarBotonesAgregar();
    
        });

    });
}