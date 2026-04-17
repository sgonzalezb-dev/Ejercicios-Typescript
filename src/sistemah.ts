import readline from 'readline';

// ─────────────────────────────────────────────────────────────
//  01 - SISTEMA DE RESERVAS DE HOTEL
//  Conceptos: objetos, arrays, filter, map, reduce, arrow functions
// ─────────────────────────────────────────────────────────────

// ── TIPOS ─────────────────────────────────────────────────────

type TipoHabitacion = 'sencilla' | 'doble' | 'suite' | 'penthouse';

interface Cliente {
  id:     number;
  nombre: string;
  vip:    boolean;
}

interface Habitacion {
  numero:         number;
  tipo:           TipoHabitacion;
  camas:          number;
  precioPorNoche: number;
  disponible:     boolean;
}

interface Reserva {
  numeroReserva: string;
  cliente:       string;
  clienteVip:    boolean;
  habitacion:    number;
  tipo:          TipoHabitacion;
  camas:         number;
  noches:        number;
  total:         number;
}

// ── DATOS INICIALES ───────────────────────────────────────────

const clientes: Cliente[] = [
  { id: 1, nombre: "Ana Torres",   vip: true  },
  { id: 2, nombre: "Luis Pérez",   vip: false },
  { id: 3, nombre: "María García", vip: true  },
  { id: 4, nombre: "Carlos Ruiz",  vip: false },
  { id: 5, nombre: "Sofía Méndez", vip: true  },
];

const habitaciones: Habitacion[] = [
  { numero: 101, tipo: "sencilla",  camas: 1, precioPorNoche: 80,  disponible: true  },
  { numero: 102, tipo: "doble",     camas: 2, precioPorNoche: 120, disponible: true  },
  { numero: 201, tipo: "suite",     camas: 2, precioPorNoche: 250, disponible: true  },
  { numero: 202, tipo: "sencilla",  camas: 1, precioPorNoche: 80,  disponible: false },
  { numero: 301, tipo: "penthouse", camas: 3, precioPorNoche: 500, disponible: true  },
  { numero: 302, tipo: "doble",     camas: 2, precioPorNoche: 120, disponible: false },
];

const reservas: Reserva[] = [];

let contadorReserva: number = 1000;

// ── FUNCIONES ─────────────────────────────────────────────────

/**
 * crearReserva: genera una nueva reserva y la agrega al array reservas[].
 * @param clienteId    - ID del cliente
 * @param habitacionNum - número de la habitación
 * @param noches        - cantidad de noches
 */
const crearReserva = (
  clienteId: number,
  habitacionNum: number,
  noches: number
): string => {
  const cliente: Cliente | undefined       = clientes.find(c => c.id === clienteId);
  const habitacion: Habitacion | undefined = habitaciones.find(h => h.numero === habitacionNum);

  if (!cliente)               return `⚠  Cliente ${clienteId} no encontrado.`;
  if (!habitacion)            return `⚠  Habitación ${habitacionNum} no existe.`;
  if (!habitacion.disponible) return `⚠  Habitación ${habitacionNum} no disponible.`;

  contadorReserva++;
  const numeroReserva: string = `RES-${contadorReserva}`;
  const total: number         = habitacion.precioPorNoche * noches;

  const nuevaReserva: Reserva = {
    numeroReserva,
    cliente:    cliente.nombre,
    clienteVip: cliente.vip,
    habitacion: habitacion.numero,
    tipo:       habitacion.tipo,
    camas:      habitacion.camas,
    noches,
    total,
  };

  reservas.push(nuevaReserva);
  habitacion.disponible = false;

  return `✔  ${numeroReserva} | ${cliente.nombre} | Hab. ${habitacionNum} (${habitacion.tipo}) | $${total}`;
};

/**
 * listarDisponibles: muestra habitaciones libres usando filter() y map().
 */
const listarDisponibles = (): void => {
  const libres: Habitacion[] = habitaciones.filter(h => h.disponible === true);

  if (libres.length === 0) { console.log("  Sin habitaciones disponibles."); return; }

  libres
    .map((h: Habitacion): string =>
      `  Hab ${h.numero} | ${h.tipo.padEnd(10)} | ${h.camas} cama(s) | $${h.precioPorNoche}/noche`
    )
    .forEach((l: string) => console.log(l));
};

/**
 * listarReservas: muestra todas las reservas con map().
 */
const listarReservas = (): void => {
  if (reservas.length === 0) { console.log("  No hay reservas registradas."); return; }

  reservas
    .map((r: Reserva, i: number): string =>
      `  [${i + 1}] ${r.numeroReserva} | ${r.cliente} | Hab ${r.habitacion} | ${r.noches} noche(s) | $${r.total}`
    )
    .forEach((l: string) => console.log(l));
};

/**
 * reservasVip: filtra y muestra solo las reservas de clientes VIP.
 */
const reservasVip = (): void => {
  const vip: Reserva[] = reservas.filter(r => r.clienteVip === true);

  if (vip.length === 0) { console.log("  No hay reservas VIP activas."); return; }

  vip
    .map((r: Reserva): string =>
      `  ★ ${r.numeroReserva} | ${r.cliente} | Hab ${r.habitacion} | $${r.total}`
    )
    .forEach((l: string) => console.log(l));
};

/**
 * ingresoTotal: suma todos los totales con reduce().
 */
const ingresoTotal = (): void => {
  const total: number = reservas.reduce(
    (acc: number, reserva: Reserva) => acc + reserva.total, 0
  );
  console.log(`  Ingreso total: $${total}`);
};

/**
 * resumenPorTipo: agrupa ingresos por tipo de habitación con filter + reduce.
 */
const resumenPorTipo = (): void => {
  if (reservas.length === 0) { console.log("  Sin datos. Crea reservas primero."); return; }

  // Set elimina duplicados; spread [...] lo convierte en array tipado
  const tipos: TipoHabitacion[] = [
    ...new Set(reservas.map((r: Reserva) => r.tipo))
  ];

  tipos.forEach((tipo: TipoHabitacion) => {
    const delTipo: Reserva[] = reservas.filter(r => r.tipo === tipo);
    const suma: number       = delTipo.reduce((acc: number, r: Reserva) => acc + r.total, 0);
    console.log(`  ${tipo.padEnd(12)} → ${delTipo.length} reserva(s) | $${suma}`);
  });
};

// ── INTERFAZ readline ─────────────────────────────────────────

const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = (): void => {
  console.log("\n─── HOTEL TS ───────────────────────────────");
  console.log(" 1. Habitaciones disponibles (filter)");
  console.log(" 2. Crear reserva de ejemplo");
  console.log(" 3. Listar reservas          (map)");
  console.log(" 4. Reservas VIP             (filter)");
  console.log(" 5. Ingreso total            (reduce)");
  console.log(" 6. Resumen por tipo         (filter + reduce)");
  console.log(" 7. Salir");
  console.log("────────────────────────────────────────────");

  rl.question(" Opción: ", (opcion: string) => {
    console.log("");
    switch (opcion.trim()) {
      case "1": listarDisponibles(); menu(); break;

      case "2": {
        const libre: Cliente | undefined     = clientes.find(
          c => !reservas.some(r => r.cliente === c.nombre)
        );
        const hab: Habitacion | undefined    = habitaciones.find(h => h.disponible);
        console.log(
          libre && hab
            ? crearReserva(libre.id, hab.numero, 3)
            : "  Sin clientes o habitaciones libres."
        );
        menu();
        break;
      }

      case "3": listarReservas(); menu(); break;
      case "4": reservasVip();    menu(); break;
      case "5": ingresoTotal();   menu(); break;
      case "6": resumenPorTipo(); menu(); break;
      case "7": console.log(" Hasta pronto.\n"); rl.close(); break;
      default:  console.log(" Opción inválida."); menu(); break;
    }
  });
};

// ── INICIO: carga 3 reservas de demo y arranca el menú ────────

console.log(crearReserva(1, 101, 3));
console.log(crearReserva(3, 201, 2));
console.log(crearReserva(2, 102, 5));
menu();