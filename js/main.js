const productos = [
  { id: 1, nombre: "vela lavanda", precio: 8000 },
  { id: 2, nombre: "vela vainilla", precio: 9500 },
  { id: 3, nombre: "vela canela", precio: 12000 },
  { id: 4, nombre: "vela coco", precio: 9000 },
  { id: 5, nombre: "vela jazmin", precio: 11000 },
  { id: 6, nombre: "vela rosas", precio: 10500 },
  { id: 7, nombre: "vela citrica", precio: 9800 },
  { id: 8, nombre: "vela chocolate", precio: 11500 },
  { id: 9, nombre: "vela frutilla", precio: 8800 },
  { id: 10, nombre: "vela cafe", precio: 10000 }
]

const listaProductos = document.querySelector("#listaproductos")
const listaCarrito = document.querySelector("#listacarrito")
const total = document.querySelector("#total")
const feedback = document.querySelector("#feedback")
const busqueda = document.querySelector("#busqueda")
const btnVaciar = document.querySelector("#btnvaciar")
const btnComprar = document.querySelector("#btncomprar")

let carrito = JSON.parse(localStorage.getItem("carrito")) || []
let catalogoActual = []

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

function mostrarMensaje(texto, clase) {
  feedback.textContent = texto
  feedback.className = `mensaje ${clase}`
}

setTimeout(() => {
  mostrarMensaje("promo del dia: 10% de descuento abonando por transferencia!", "info")
}, 3000)

function obtenerProductos() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exito = Math.random() > 0.1
      if (exito) {
        resolve(productos)
      } else {
        reject(new Error("no se pudo cargar el catalogo de productos."))
      }
    }, 2000)
  })
}

async function cargarCatalogo() {
  mostrarMensaje("cargando productos...", "info")

  try {
    catalogoActual = await obtenerProductos()
    renderizarProductos(catalogoActual)
    mostrarMensaje(`${catalogoActual.length} productos cargados con exito.`, "exito")
  } catch (error) {
    mostrarMensaje(error.message, "error")
  } finally {
    console.log("proceso de carga de productos finalizado.")
  }
}

function renderizarProductos(lista) {
  listaProductos.innerHTML = ""

  if (lista.length === 0) {
    const li = document.createElement("li")
    li.textContent = "no se encontraron productos."
    listaProductos.appendChild(li)
    return
  }

  lista.forEach(producto => {
    const li = document.createElement("li")
    li.classList.add("producto")

    li.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio.toLocaleString("es-ar")}</p>
    `

    const boton = document.createElement("button")
    boton.textContent = "agregar al carrito"
    boton.classList.add("btn-agregar")
    boton.addEventListener("click", () => {
      agregarAlCarrito(producto)
    })

    li.appendChild(boton)
    listaProductos.appendChild(li)
  })
}

function agregarAlCarrito(producto) {
  const existe = carrito.find(item => item.id === producto.id)

  if (existe) {
    existe.cantidad++
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    })
  }

  guardarCarrito()
  renderizarCarrito()
  mostrarMensaje(`${producto.nombre} agregado al carrito`, "exito")
}

function renderizarCarrito() {
  listaCarrito.innerHTML = ""

  let totalCompra = 0

  if (carrito.length === 0) {
    const li = document.createElement("li")
    li.textContent = "el carrito esta vacio."
    listaCarrito.appendChild(li)
    total.textContent = "total: $0"
    return
  }

  carrito.forEach(item => {
    totalCompra += item.precio * item.cantidad

    const li = document.createElement("li")
    li.classList.add("item-carrito")

    li.innerHTML = `
      <h3>${item.nombre}</h3>
      <p>cantidad: ${item.cantidad}</p>
      <p>subtotal: $${(item.precio * item.cantidad).toLocaleString("es-ar")}</p>
    `

    const botonEliminar = document.createElement("button")
    botonEliminar.textContent = "eliminar"
    botonEliminar.classList.add("btn-eliminar")
    botonEliminar.addEventListener("click", () => {
      eliminarDelCarrito(item.id)
    })

    li.appendChild(botonEliminar)
    listaCarrito.appendChild(li)
  })

  total.textContent = `total: $${totalCompra.toLocaleString("es-ar")}`
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id)
  guardarCarrito()
  renderizarCarrito()
  mostrarMensaje("producto eliminado", "error")
}

function filtrarProductos() {
  const texto = busqueda.value.toLowerCase()

  const resultado = catalogoActual.filter(producto =>
    producto.nombre.toLowerCase().includes(texto)
  )

  renderizarProductos(resultado)
}

function vaciarCarrito() {
  carrito = []
  guardarCarrito()
  renderizarCarrito()
  mostrarMensaje("carrito vaciado.", "error")
}

function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje("el carrito esta vacio.", "error")
    return
  }

  try {
    carrito = []
    guardarCarrito()
    renderizarCarrito()
    mostrarMensaje("compra finalizada con exito!", "exito")
  } catch (error) {
    mostrarMensaje("hubo un error al procesar la compra.", "error")
  }
}

busqueda.addEventListener("keyup", filtrarProductos)
btnVaciar.addEventListener("click", vaciarCarrito)
btnComprar.addEventListener("click", finalizarCompra)

cargarCatalogo()
renderizarCarrito()