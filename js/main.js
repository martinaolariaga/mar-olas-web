// Variable global para almacenar los productos cargados vía FETCH
let productos = [];

// Estado del Carrito (Carga previa desde LocalStorage)
let carrito = JSON.parse(localStorage.getItem("carrito_mar_olas")) || [];

// Elementos del DOM
const contenedorHombres = document.getElementById("contenedor-hombres");
const contenedorMujeres = document.getElementById("contenedor-mujeres");
const contenedorAccesorios = document.getElementById("contenedor-accesorios");

const listaCarrito = document.getElementById("lista-carrito");
const precioTotal = document.getElementById("precio-total");
const contadorCarrito = document.getElementById("contador-carrito");
const btnVaciar = document.getElementById("btn-vaciar");
const btnFinalizar = document.getElementById("btn-finalizar");

// ==========================================
// 1. CARGA ASINCRÓNICA CON FETCH (JSON)
// ==========================================
async function obtenerProductos() {
    try {
        const respuesta = await fetch("../json/productos.json");
        productos = await respuesta.json();
        renderizarCatalogo();
    } catch (error) {
        // Manejo silencioso de error
    }
}

// ==========================================
// 2. RENDERIZAR PRODUCTOS
// ==========================================
function renderizarCatalogo() {
    const hombres = productos.filter(p => p.categoria === "hombres");
    const mujeres = productos.filter(p => p.categoria === "mujeres");
    const accesorios = productos.filter(p => p.categoria === "accesorios");

    const crearCards = (lista, contenedor) => {
        if (!contenedor) return;
        contenedor.innerHTML = "";
        lista.forEach(prod => {
            const div = document.createElement("div");
            div.className = "col-12 col-md-4";
            div.innerHTML = `
                <div class="card h-100 shadow-sm border-0">
                    <img src="${prod.img}" class="card-img-top p-3" alt="${prod.nombre}">
                    <div class="card-body text-center d-flex flex-column justify-content-between">
                        <div>
                            <h3 class="h5 fw-bold">${prod.nombre}</h3>
                            <p class="text-muted small my-2">${prod.descripcion}</p>
                            <p class="text-dark fs-5 fw-bold mb-3">$${prod.precio.toLocaleString()}</p>
                        </div>
                        <button class="btn btn-info text-white fw-bold w-100 mt-2" onclick="agregarAlCarrito(${prod.id})">
                            Agregar al carrito 🛒
                        </button>
                    </div>
                </div>
            `;
            contenedor.appendChild(div);
        });
    };

    crearCards(hombres, contenedorHombres);
    crearCards(mujeres, contenedorMujeres);
    crearCards(accesorios, contenedorAccesorios);
}

// ==========================================
// 3. LÓGICA DEL CARRITO + LIBRERÍAS EXTERNAS
// ==========================================
function agregarAlCarrito(id) {
    const productoEncontrado = productos.find(p => p.id === id);
    const existeEnCarrito = carrito.find(p => p.id === id);

    if (existeEnCarrito) {
        existeEnCarrito.cantidad++;
    } else {
        carrito.push({ ...productoEncontrado, cantidad: 1 });
    }

    actualizarCarritoUI();

    // Notificación con la librería Toastify
    Toastify({
        text: `¡${productoEncontrado.nombre} agregado al carrito!`,
        duration: 2500,
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, #0dcaf0, #0d6efd)",
            borderRadius: "8px",
            color: "#fff"
        }
    }).showToast();
}

function actualizarCarritoUI() {
    if (!listaCarrito) return;
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `<p class="text-center text-muted py-3">El carrito está vacío 🌊</p>`;
    } else {
        carrito.forEach(prod => {
            const item = document.createElement("div");
            item.className = "d-flex justify-content-between align-items-center mb-3 p-2 border-bottom";
            item.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <img src="${prod.img}" width="50" alt="${prod.nombre}">
                    <div>
                        <h6 class="mb-0 fw-bold">${prod.nombre}</h6>
                        <small class="text-muted">$${prod.precio.toLocaleString()} x ${prod.cantidad}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold me-2">$${(prod.precio * prod.cantidad).toLocaleString()}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${prod.id})">🗑️</button>
                </div>
            `;
            listaCarrito.appendChild(item);
        });
    }

    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    if (precioTotal) precioTotal.textContent = `$${total.toLocaleString()}`;

    const totalUnidades = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    if (contadorCarrito) contadorCarrito.textContent = totalUnidades;

    localStorage.setItem("carrito_mar_olas", JSON.stringify(carrito));
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarritoUI();
}

// Vaciar Carrito
if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
        if (carrito.length === 0) return;
        
        Swal.fire({
            title: "¿Vaciar el carrito?",
            text: "Vas a quitar todos los productos seleccionados.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                actualizarCarritoUI();
                Swal.fire("Carrito vaciado", "", "success");
            }
        });
    });
}

// Finalizar Compra (Completar circuito de negocio)
if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire("Tu carrito está vacío", "Agregá productos antes de finalizar la compra.", "info");
            return;
        }

        Swal.fire({
            title: "¡Gracias por tu compra en Mar Olas! 🌊",
            text: "Procesando el pedido de equipamiento...",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#0dcaf0"
        });

        carrito = [];
        actualizarCarritoUI();
    });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
obtenerProductos();
actualizarCarritoUI();