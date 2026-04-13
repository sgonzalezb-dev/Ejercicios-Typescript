import readline from 'readline';

// ─────────────────────────────────────────────────────────────
//  05 - VENTA DE BOLETAS - ESTADIO
//  Conceptos: objetos, arrays, filter, map, reduce, find,
//             arrow functions, spread operator, Date
// ─────────────────────────────────────────────────────────────

// ── TIPOS ─────────────────────────────────────────────────────

type CodigoZona = 'N' | 'S' | 'O' | 'E' | 'P';

interface Evento {
  nombre:  string;
  equipos: string;
  fecha:   string;
  hora:    string;
  estadio: string;
}

interface Zona {
  codigo:    CodigoZona;
  nombre:    string;
  capacidad: number;
  precio:    number;
}

interface Venta {
  codigo:         string;
  comprador:      string;
  zona:           CodigoZona;
  nombreZona:     string;
  cantidad:       number;
  precioUnitario: number;
  total:          number;
  fecha:          string;
}

// ── CONFIGURACIÓN DEL EVENTO ──────────────────────────────────

const evento: Evento = {
  nombre:  "Final Copa Ciudad",
  equipos: "América FC vs. Deportivo Sur",
  fecha:   "2025-09-20",
  hora:    "15:00",
  estadio: "Estadio Municipal",
};

const zonas: Zona[] = [
  { codigo: "N", nombre: "Norte (General)",    capacidad: 5000, precio: 30000  },
  { codigo: "S", nombre: "Sur (General)",      capacidad: 5000, precio: 30000  },
  { codigo: "O", nombre: "Occidental (VIP)",   capacidad: 2000, precio: 80000  },
  { codigo: "E", nombre: "Oriental (VIP)",     capacidad: 2000, precio: 80000  },
  { codigo: "P", nombre: "Palco Preferencial", capacidad: 500,  precio: 150000 },
];

const ventasRealizadas: Venta[] = [];

let contadorBoleta: number = 5000;

// ── FUNCIONES DE UTILIDAD ─────────────────────────────────────

const formatPesos = (valor: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(valor);

/**
 * boletasVendidasPorZona: cuenta cuántas boletas se han vendido en una zona.
 * Usa filter() para filtrar las ventas de esa zona y reduce() para sumar.
 */
const boletasVendidasPorZona = (codigoZona: CodigoZona): number =>
  ventasRealizadas
    .filter((v: Venta) => v.zona === codigoZona)
    .reduce((acc: number, v: Venta) => acc + v.cantidad, 0);

/**
 * disponibilidadZona: calcula las boletas restantes en una zona.
 */
const disponibilidadZona = (codigoZona: CodigoZona): number => {
  const zona: Zona | undefined = zonas.find(z => z.codigo === codigoZona);
  return zona ? zona.capacidad - boletasVendidasPorZona(codigoZona) : 0;
};

// ── FUNCIONES PRINCIPALES ─────────────────────────────────────

/**
 * verDisponibilidad: muestra todas las zonas con sus boletas disponibles.
 */
const verDisponibilidad = (): void => {
  console.log(`\n  Evento   : ${evento.nombre}`);
  console.log(`  Partidos : ${evento.equipos}`);
  console.log(`  Fecha    : ${evento.fecha}  ${evento.hora}`);
  console.log(`  Estadio  : ${evento.estadio}`);
  console.log("\n  ─ Zonas disponibles ─");

  zonas
    .map((z: Zona): string => {
      const disponibles: number = disponibilidadZona(z.codigo);
      const vendidas: number    = boletasVendidasPorZona(z.codigo);
      const porcentaje: number  = Math.round((vendidas / z.capacidad) * 100);
      const estado: string      = disponibles === 0 ? " [AGOTADO]" : "";
      return `  [${z.codigo}] ${z.nombre.padEnd(22)} | ${formatPesos(z.precio).padEnd(14)} | Disponibles: ${disponibles}/${z.capacidad} (${porcentaje}% lleno)${estado}`;
    })
    .forEach((l: string) => console.log(l));

  const totalDisponibles: number = zonas.reduce(
    (acc: number, z: Zona) => acc + disponibilidadZona(z.codigo), 0
  );
  const capacidadTotal: number = zonas.reduce(
    (acc: number, z: Zona) => acc + z.capacidad, 0
  );

  console.log("\n  ─────────────────────────────────────────");
  console.log(`  Total disponible: ${totalDisponibles} de ${capacidadTotal} boletas`);
};

/**
 * comprarBoletas: registra la compra de boletas para una zona.
 * @param nombreComprador - nombre del comprador
 * @param codigoZonaInput - zona elegida (se normaliza a mayúscula)
 * @param cantidad        - boletas a comprar
 */
const comprarBoletas = (
  nombreComprador: string,
  codigoZonaInput: string,
  cantidad: number
): void => {
  const zona: Zona | undefined = zonas.find(
    z => z.codigo === codigoZonaInput.toUpperCase()
  );

  if (!zona)         { console.log("  ⚠  Zona no encontrada."); return; }
  if (cantidad <= 0) { console.log("  ⚠  Cantidad inválida.");  return; }

  const disponibles: number = disponibilidadZona(zona.codigo);

  if (cantidad > disponibles) {
    console.log(`  ⚠  Solo hay ${disponibles} boletas disponibles en ${zona.nombre}.`);
    return;
  }

  if (cantidad > 10) {
    console.log("  ⚠  Máximo 10 boletas por compra.");
    return;
  }

  contadorBoleta++;
  const codigoVenta: string = `BOL-${contadorBoleta}`;
  const subtotal: number    = zona.precio * cantidad;

  const nuevaVenta: Venta = {
    codigo:         codigoVenta,
    comprador:      nombreComprador,
    zona:           zona.codigo,
    nombreZona:     zona.nombre,
    cantidad,
    precioUnitario: zona.precio,
    total:          subtotal,
    fecha:          new Date().toLocaleString('es-CO'),
  };

  ventasRealizadas.push(nuevaVenta);

  // Array.from crea un array de longitud 'cantidad' y map lo llena con códigos
  const codigosBoletas: string[] = Array.from(
    { length: cantidad },
    (_: unknown, i: number) => `${codigoVenta}-${String(i + 1).padStart(2, '0')}`
  );

  console.log("\n  ══════════════════════════════════════");
  console.log("   COMPROBANTE DE COMPRA");
  console.log("  ══════════════════════════════════════");
  console.log(`   Código venta : ${codigoVenta}`);
  console.log(`   Comprador    : ${nombreComprador}`);
  console.log(`   Evento       : ${evento.nombre}`);
  console.log(`   Zona         : ${zona.nombre}`);
  console.log(`   Cantidad     : ${cantidad} boleta(s)`);
  console.log(`   Precio unit. : ${formatPesos(zona.precio)}`);
  console.log(`   TOTAL        : ${formatPesos(subtotal)}`);
  console.log(`   Fecha        : ${nuevaVenta.fecha}`);
  console.log("  ──────────────────────────────────────");
  console.log("   Códigos de boletas:");
  codigosBoletas.map((c: string) => `   · ${c}`).forEach((l: string) => console.log(l));
  console.log("  ══════════════════════════════════════");
};

/**
 * historialVentas: muestra todas las ventas con el recaudo total.
 */
const historialVentas = (): void => {
  console.log("\n  ─ Historial de ventas ─");

  if (ventasRealizadas.length === 0) {
    console.log("  Sin ventas registradas.");
    return;
  }

  ventasRealizadas
    .map((v: Venta, i: number): string =>
      `  [${i + 1}] ${v.codigo} | ${v.comprador.padEnd(16)} | ${v.nombreZona.padEnd(22)} | ${v.cantidad} boleta(s) | ${formatPesos(v.total)}`
    )
    .forEach((l: string) => console.log(l));

  const recaudoTotal: number = ventasRealizadas.reduce(
    (acc: number, v: Venta) => acc + v.total, 0
  );
  const totalBoletas: number = ventasRealizadas.reduce(
    (acc: number, v: Venta) => acc + v.cantidad, 0
  );

  console.log("  ─────────────────────────────────────────");
  console.log(`  Boletas vendidas : ${totalBoletas}`);
  console.log(`  Recaudo total    : ${formatPesos(recaudoTotal)}`);
};

/**
 * buscarBoleta: localiza una venta por su código con find().
 */
const buscarBoleta = (codigoVenta: string): void => {
  const venta: Venta | undefined = ventasRealizadas.find(
    v => v.codigo === codigoVenta.toUpperCase()
  );

  if (!venta) {
    console.log(`  ⚠  Código ${codigoVenta} no encontrado.`);
    return;
  }

  console.log(`\n  ✔  Venta válida`);
  console.log(`     Comprador : ${venta.comprador}`);
  console.log(`     Zona      : ${venta.nombreZona}`);
  console.log(`     Boletas   : ${venta.cantidad}`);
  console.log(`     Total     : ${formatPesos(venta.total)}`);
  console.log(`     Fecha     : ${venta.fecha}`);
};

/**
 * resumenPorZona: estadísticas de recaudo agrupadas por zona.
 */
const resumenPorZona = (): void => {
  if (ventasRealizadas.length === 0) {
    console.log("  Sin ventas para mostrar resumen.");
    return;
  }

  console.log("\n  ─ Resumen por zona ─");

  zonas.forEach((z: Zona) => {
    const ventasZona: Venta[] = ventasRealizadas.filter(
      (v: Venta) => v.zona === z.codigo
    );

    if (ventasZona.length === 0) return;

    const recaudo: number = ventasZona.reduce(
      (acc: number, v: Venta) => acc + v.total, 0
    );
    const boletas: number = ventasZona.reduce(
      (acc: number, v: Venta) => acc + v.cantidad, 0
    );

    console.log(`  ${z.nombre.padEnd(22)} | ${boletas} boletas | ${formatPesos(recaudo)}`);
  });
};

// ── INTERFAZ readline ─────────────────────────────────────────

const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = (): void => {
  console.log("\n─── VENTA DE BOLETAS - ESTADIO ─────────────");
  console.log(" 1. Ver disponibilidad de zonas");
  console.log(" 2. Comprar boletas");
  console.log(" 3. Historial de ventas");
  console.log(" 4. Buscar boleta por código");
  console.log(" 5. Resumen de ventas por zona");
  console.log(" 6. Salir");
  console.log("────────────────────────────────────────────");

  rl.question(" Opción: ", (opcion: string) => {
    switch (opcion.trim()) {
      case "1":
        verDisponibilidad();
        menu();
        break;

      case "2":
        rl.question("  Nombre del comprador: ", (nombre: string) => {
          rl.question("  Zona (N/S/O/E/P): ", (zona: string) => {
            rl.question("  Cantidad de boletas: ", (cant: string) => {
              comprarBoletas(nombre.trim(), zona.trim(), Number(cant));
              menu();
            });
          });
        });
        break;

      case "3": historialVentas(); menu(); break;

      case "4":
        rl.question("  Código de venta (ej: BOL-5001): ", (codigo: string) => {
          buscarBoleta(codigo.trim());
          menu();
        });
        break;

      case "5": resumenPorZona(); menu(); break;
      case "6": console.log("\n  ¡Hasta el partido!\n"); rl.close(); break;
      default:  console.log("  Opción inválida."); menu(); break;
    }
  });
};

// ── INICIO ────────────────────────────────────────────────────

console.log("\n════════════════════════════════════════════");
console.log("       SISTEMA DE VENTA DE BOLETAS");
console.log(`       ${evento.equipos}`);
console.log("════════════════════════════════════════════");
menu();