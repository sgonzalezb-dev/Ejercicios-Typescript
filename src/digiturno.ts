import readline from 'readline';

// ─────────────────────────────────────────────────────────────
//  04 - DIGITURNO
//  Conceptos: objetos, arrays, push, shift (cola FIFO),
//             filter, map, reduce, arrow functions
//
//  Lógica de la cola: FIFO (First In, First Out)
//  El primero en llegar es el primero en ser atendido.
//  → push()  agrega al FINAL de la cola (llegada)
//  → shift() saca del INICIO de la cola (atención)
// ─────────────────────────────────────────────────────────────

// ── TIPOS ─────────────────────────────────────────────────────

type CodigoServicio = 'CAJA' | 'INFO' | 'CREDITO' | 'RECLAMO';

type EstadoTurno = 'en espera' | 'atendido';

interface Servicio {
  nombre: string;
  tiempoEstimado: number;
}

interface Turno {
  turno: string;
  nombre: string;
  servicio: CodigoServicio;
  posicion: number;
  horaLlegada: string;
  estado: EstadoTurno;
  horaAtencion?: string; // opcional: solo se asigna cuando es atendido
}

// ── ESTADO DEL SISTEMA ────────────────────────────────────────

let cola: Turno[] = [];
let atendidos: Turno[] = [];
let contadorTurno: number = 0;

const servicios: Record<CodigoServicio, Servicio> = {
  "CAJA":    { nombre: "Caja",        tiempoEstimado: 5  },
  "INFO":    { nombre: "Información", tiempoEstimado: 3  },
  "CREDITO": { nombre: "Créditos",    tiempoEstimado: 15 },
  "RECLAMO": { nombre: "Reclamos",    tiempoEstimado: 10 },
};

// ── FUNCIONES DEL DIGITURNO ───────────────────────────────────

/**
 * asignarTurno: crea un nuevo turno y lo agrega al FINAL de la cola.
 * @param nombre   - nombre de la persona
 * @param servicio - código del servicio (ej: "CAJA")
 */
const asignarTurno = (nombre: string, servicio: string): void => {
  const servicioUpper = servicio.toUpperCase() as CodigoServicio;

  if (!servicios[servicioUpper]) {
    console.log(`  ⚠  Servicio "${servicio}" no existe. Opciones: ${Object.keys(servicios).join(', ')}`);
    return;
  }

  contadorTurno++;
  const codigoTurno = `${servicioUpper}-${String(contadorTurno).padStart(3, '0')}`;

  const nuevoTurno: Turno = {
    turno:       codigoTurno,
    nombre,
    servicio:    servicioUpper,
    posicion:    cola.length + 1,
    horaLlegada: new Date().toLocaleTimeString('es-CO'),
    estado:      "en espera",
  };

  cola.push(nuevoTurno);

  const tiempoEspera: number = cola
    .slice(0, -1)
    .reduce((acc: number, t: Turno) => acc + servicios[t.servicio].tiempoEstimado, 0);

  console.log(`\n  ══════════════════════════════`);
  console.log(`   TURNO ASIGNADO: ${codigoTurno}`);
  console.log(`   Cliente : ${nombre}`);
  console.log(`   Servicio: ${servicios[servicioUpper].nombre}`);
  console.log(`   Posición: ${cola.length} en la cola`);
  console.log(`   Espera aprox.: ${tiempoEspera} minutos`);
  console.log(`  ══════════════════════════════`);
};

/**
 * llamarSiguiente: atiende al PRIMER turno de la cola.
 * shift() extrae el primer elemento (cola FIFO).
 */
const llamarSiguiente = (): void => {
  if (cola.length === 0) {
    console.log("\n  ⚠  La cola está vacía. No hay turnos pendientes.");
    return;
  }

  // shift() puede devolver undefined si el array está vacío,
  // pero ya lo validamos arriba, así que usamos la aserción !
  const turnoAtendido = cola.shift()!;
  turnoAtendido.estado       = "atendido";
  turnoAtendido.horaAtencion = new Date().toLocaleTimeString('es-CO');

  atendidos.push(turnoAtendido);

  console.log(`\n  ► Llamando al turno: ${turnoAtendido.turno}`);
  console.log(`    Cliente : ${turnoAtendido.nombre}`);
  console.log(`    Servicio: ${servicios[turnoAtendido.servicio].nombre}`);

  cola = cola.map((t: Turno, index: number): Turno => ({
    ...t,
    posicion: index + 1,
  }));

  if (cola.length > 0) {
    console.log(`\n    Próximo turno: ${cola[0].turno} (${cola[0].nombre})`);
  } else {
    console.log("\n    Cola vacía. No hay más turnos.");
  }
};

/**
 * verCola: muestra todos los turnos en espera con su posición actual.
 */
const verCola = (): void => {
  console.log(`\n  ─ Cola de espera (${cola.length} persona(s)) ─`);

  if (cola.length === 0) {
    console.log("  No hay nadie en cola.");
    return;
  }

  cola
    .map((t: Turno): string =>
      `  [${t.posicion}] ${t.turno.padEnd(10)} | ${t.nombre.padEnd(16)} | ${servicios[t.servicio].nombre} | Llegó: ${t.horaLlegada}`
    )
    .forEach((l: string) => console.log(l));

  const tiempoTotal: number = cola.reduce(
    (acc: number, t: Turno) => acc + servicios[t.servicio].tiempoEstimado,
    0
  );
  console.log(`\n  Tiempo total estimado de la cola: ${tiempoTotal} minutos`);
};

/**
 * estadisticas: genera un resumen de la jornada usando filter y reduce.
 */
const estadisticas = (): void => {
  const totalAtendidos: number = atendidos.length;

  if (totalAtendidos === 0) {
    console.log("\n  Sin estadísticas aún. Atiende algunos turnos primero.");
    return;
  }

  console.log("\n  ─ Estadísticas de la jornada ─");
  console.log(`  Total atendidos : ${totalAtendidos}`);
  console.log(`  En espera       : ${cola.length}`);
  console.log(`  Total generados : ${contadorTurno}`);

  (Object.keys(servicios) as CodigoServicio[]).forEach((tipo: CodigoServicio) => {
    const count: number = atendidos.filter((t: Turno) => t.servicio === tipo).length;
    if (count > 0) console.log(`  ${servicios[tipo].nombre.padEnd(16)}: ${count} atendido(s)`);
  });
};

/**
 * cancelarTurno: elimina un turno específico de la cola usando filter().
 * @param codigoTurno - código del turno a cancelar (ej: "CAJA-002")
 */
const cancelarTurno = (codigoTurno: string): void => {
  const codigoUpper: string = codigoTurno.toUpperCase();
  const existe: Turno | undefined = cola.find((t: Turno) => t.turno === codigoUpper);

  if (!existe) {
    console.log(`  ⚠  Turno ${codigoTurno} no está en la cola.`);
    return;
  }

  cola = cola.filter((t: Turno) => t.turno !== codigoUpper);
  cola = cola.map((t: Turno, index: number): Turno => ({ ...t, posicion: index + 1 }));

  console.log(`  ✔  Turno ${codigoTurno} cancelado. Quedan ${cola.length} en cola.`);
};

// ── INTERFAZ readline ─────────────────────────────────────────

const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = (): void => {
  console.log("\n─── DIGITURNO ──────────────────────────────");
  console.log(" 1. Asignar turno");
  console.log(" 2. Llamar siguiente turno");
  console.log(" 3. Ver cola completa");
  console.log(" 4. Cancelar turno");
  console.log(" 5. Estadísticas");
  console.log(" 6. Salir");
  console.log("────────────────────────────────────────────");
  console.log(` Personas en cola: ${cola.length}`);
  console.log("────────────────────────────────────────────");

  rl.question(" Opción: ", (opcion: string) => {
    switch (opcion.trim()) {
      case "1":
        console.log("\n  Servicios: CAJA | INFO | CREDITO | RECLAMO");
        rl.question("  Nombre del cliente: ", (nombre: string) => {
          rl.question("  Servicio: ", (servicio: string) => {
            asignarTurno(nombre.trim(), servicio.trim());
            menu();
          });
        });
        break;

      case "2": llamarSiguiente(); menu(); break;
      case "3": verCola();         menu(); break;

      case "4":
        rl.question("  Código del turno a cancelar (ej: CAJA-001): ", (turno: string) => {
          cancelarTurno(turno.trim());
          menu();
        });
        break;

      case "5": estadisticas(); menu(); break;
      case "6": console.log("\n  Sistema apagado.\n"); rl.close(); break;
      default:  console.log("  Opción inválida."); menu(); break;
    }
  });
};

// ── INICIO ────────────────────────────────────────────────────

console.log("\n════════════════════════════════════════════");
console.log("             SISTEMA DIGITURNO");
console.log("════════════════════════════════════════════");
menu();