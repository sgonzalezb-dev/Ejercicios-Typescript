import readline from 'readline';

// ─────────────────────────────────────────────────────────────
//  03 - CARRITO DE COMPRAS
//  Conceptos: objetos, arrays, filter, map, reduce, find,
//             arrow functions, spread operator
// ─────────────────────────────────────────────────────────────

// ── TIPOS ─────────────────────────────────────────────────────

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface ItemCarrito extends Producto {
  cantidad: number;
  subtotal: number;
}

// ── CATÁLOGO DE PRODUCTOS ─────────────────────────────────────

const catalogo: Producto[] = [
  { id: 1, nombre: "Camiseta",  precio: 35000,  stock: 10 },
  { id: 2, nombre: "Pantalón",  precio: 75000,  stock: 5  },
  { id: 3, nombre: "Zapatos",   precio: 120000, stock: 8  },
  { id: 4, nombre: "Gorra",     precio: 25000,  stock: 15 },
  { id: 5, nombre: "Chaqueta",  precio: 180000, stock: 3  },
  { id: 6, nombre: "Medias x3", precio: 15000,  stock: 20 },
  { id: 7, nombre: "Correa",    precio: 40000,  stock: 7  },
  { id: 8, nombre: "Mochila",   precio: 95000,  stock: 6  },
];

let carrito: ItemCarrito[] = [];

// ── FUNCIONES DEL CARRITO ─────────────────────────────────────

/**
 * formatPesos: convierte un número a formato de moneda colombiana (COP).
 */
const formatPesos = (valor: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(valor);

/**
 * verCatalogo: muestra todos los productos disponibles.
 */
const verCatalogo = (): void => {
  console.log("\n  ─ Catálogo de productos ─");
  catalogo
    .map((p: Producto): string =>
      `  [${p.id}] ${p.nombre.padEnd(14)} | ${formatPesos(p.precio).padEnd(14)} | Stock: ${p.stock}`
    )
    .forEach((l: string) => console.log(l));
};

/**
 * agregarProducto: agrega un producto al carrito o aumenta su cantidad.
 * @param productoId - ID del producto del catálogo
 * @param cantidad   - unidades a agregar
 */
const agregarProducto = (productoId: number, cantidad: number): void => {
  const producto: Producto | undefined = catalogo.find(p => p.id === productoId);

  if (!producto)                 { console.log("  ⚠  Producto no encontrado.");                                return; }
  if (cantidad <= 0)             { console.log("  ⚠  Cantidad inválida.");                                     return; }
  if (producto.stock < cantidad) { console.log(`  ⚠  Stock insuficiente (disponible: ${producto.stock}).`);   return; }

  const enCarrito: ItemCarrito | undefined = carrito.find(item => item.id === productoId);

  if (enCarrito) {
    enCarrito.cantidad += cantidad;
    enCarrito.subtotal  = enCarrito.precio * enCarrito.cantidad;
    console.log(`  ✔  Cantidad actualizada: ${enCarrito.nombre} × ${enCarrito.cantidad}`);
  } else {
    carrito.push({
      ...producto,
      cantidad,
      subtotal: producto.precio * cantidad,
    });
    console.log(`  ✔  Agregado: ${producto.nombre} × ${cantidad}`);
  }

  producto.stock -= cantidad;
};

/**
 * quitarProducto: reduce la cantidad de un producto en el carrito.
 * Si la cantidad llega a 0, lo elimina con filter().
 * @param productoId - ID del producto a quitar
 * @param cantidad   - unidades a quitar
 */
const quitarProducto = (productoId: number, cantidad: number): void => {
  const enCarrito: ItemCarrito | undefined = carrito.find(item => item.id === productoId);

  if (!enCarrito)    { console.log("  ⚠  Producto no está en el carrito."); return; }
  if (cantidad <= 0) { console.log("  ⚠  Cantidad inválida.");              return; }

  if (cantidad >= enCarrito.cantidad) {
    carrito = carrito.filter(item => item.id !== productoId);

    const producto: Producto | undefined = catalogo.find(p => p.id === productoId);
    if (producto) producto.stock += enCarrito.cantidad;

    console.log(`  ✔  ${enCarrito.nombre} eliminado del carrito.`);
  } else {
    enCarrito.cantidad -= cantidad;
    enCarrito.subtotal  = enCarrito.precio * enCarrito.cantidad;

    const producto: Producto | undefined = catalogo.find(p => p.id === productoId);
    if (producto) producto.stock += cantidad;

    console.log(`  ✔  Cantidad reducida. ${enCarrito.nombre} × ${enCarrito.cantidad}`);
  }
};

/**
 * verCarrito: muestra el contenido del carrito con map() y reduce().
 */
const verCarrito = (): void => {
  if (carrito.length === 0) { console.log("\n  El carrito está vacío."); return; }

  console.log("\n  ─ Mi carrito ─");

  carrito
    .map((item: ItemCarrito): string =>
      `  [${item.id}] ${item.nombre.padEnd(14)} | ${formatPesos(item.precio)} × ${item.cantidad} = ${formatPesos(item.subtotal)}`
    )
    .forEach((l: string) => console.log(l));

  const total: number = carrito.reduce((acc: number, item: ItemCarrito) => acc + item.subtotal, 0);

  console.log("  ─────────────────────────────────────────");
  console.log(`  TOTAL: ${formatPesos(total)}`);
  console.log(`  Productos en carrito: ${carrito.length}`);
};

/**
 * vaciarCarrito: elimina todos los productos y devuelve el stock.
 */
const vaciarCarrito = (): void => {
  if (carrito.length === 0) { console.log("  El carrito ya está vacío."); return; }

  carrito.forEach((item: ItemCarrito) => {
    const producto: Producto | undefined = catalogo.find(p => p.id === item.id);
    if (producto) producto.stock += item.cantidad;
  });

  carrito = [];
  console.log("  ✔  Carrito vaciado.");
};

/**
 * finalizarCompra: confirma la compra y muestra la factura.
 */
const finalizarCompra = (): void => {
  if (carrito.length === 0) { console.log("  ⚠  El carrito está vacío."); return; }

  const total: number = carrito.reduce((acc: number, item: ItemCarrito) => acc + item.subtotal, 0);

  console.log("\n  ══════════════ FACTURA ══════════════");
  console.log(`  Fecha: ${new Date().toLocaleDateString('es-CO')}`);
  console.log("  ─────────────────────────────────────");

  carrito.forEach((item: ItemCarrito) =>
    console.log(`  ${item.nombre.padEnd(14)} × ${item.cantidad}  ${formatPesos(item.subtotal)}`)
  );

  console.log("  ─────────────────────────────────────");
  console.log(`  TOTAL A PAGAR : ${formatPesos(total)}`);
  console.log("  ══════════════════════════════════════");
  console.log("  ✔  ¡Compra realizada con éxito!");

  carrito = [];
};

// ── INTERFAZ readline ─────────────────────────────────────────

const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = (): void => {
  console.log("\n─── CARRITO DE COMPRAS ─────────────────────");
  console.log(" 1. Ver catálogo");
  console.log(" 2. Agregar producto al carrito");
  console.log(" 3. Quitar producto del carrito");
  console.log(" 4. Ver carrito");
  console.log(" 5. Vaciar carrito");
  console.log(" 6. Finalizar compra");
  console.log(" 7. Salir");
  console.log("────────────────────────────────────────────");

  rl.question(" Opción: ", (opcion: string) => {
    switch (opcion.trim()) {
      case "1":
        verCatalogo();
        menu();
        break;

      case "2":
        rl.question("  ID del producto: ", (id: string) => {
          rl.question("  Cantidad: ", (cant: string) => {
            agregarProducto(Number(id), Number(cant));
            menu();
          });
        });
        break;

      case "3":
        rl.question("  ID del producto a quitar: ", (id: string) => {
          rl.question("  Cantidad a quitar: ", (cant: string) => {
            quitarProducto(Number(id), Number(cant));
            menu();
          });
        });
        break;

      case "4": verCarrito();      menu(); break;
      case "5": vaciarCarrito();   menu(); break;
      case "6": finalizarCompra(); menu(); break;
      case "7": console.log("\n  ¡Hasta pronto!\n"); rl.close(); break;
      default:  console.log("  Opción inválida."); menu(); break;
    }
  });
};

// ── INICIO ────────────────────────────────────────────────────

console.log("\n════════════════════════════════════════════");
console.log("         TIENDA - CARRITO DE COMPRAS");
console.log("════════════════════════════════════════════");
menu();