import * as readline from 'readline';

// ─────────────────────────────────────────────────────────────
//  02 - CAJERO AUTOMÁTICO
//  Conceptos: objetos, arrow functions, métodos de array (map),
//             manejo de estado, operaciones bancarias
// ─────────────────────────────────────────────────────────────

// ── TIPOS ─────────────────────────────────────────────────────

type TipoMovimiento = 'retiro' | 'consignacion' | 'transferencia' | 'transferencia recibida';

interface Movimiento {
  tipo: TipoMovimiento;
  monto: number;
  detalle: string;
  fecha: string;
}

interface Cuenta {
  numero: string;
  titular: string;
  pin: string;
  saldo: number;
  movimientos: Movimiento[];
}

// ── DATOS: cuentas bancarias disponibles ─────────────────────

const cuentas: Cuenta[] = [
  {
    numero: "001-2024",
    titular: "Ana Torres",
    pin: "1234",
    saldo: 2500000,
    movimientos: [],
  },
  {
    numero: "002-2024",
    titular: "Luis Pérez",
    pin: "5678",
    saldo: 800000,
    movimientos: [],
  },
];

// Variable que almacena la cuenta activa durante la sesión
// null = nadie ha iniciado sesión todavía
let cuentaActiva: Cuenta | null = null;

// ── FUNCIONES DE UTILIDAD ─────────────────────────────────────

/**
 * formatPesos: formatea un número como moneda colombiana (COP).
 */
const formatPesos = (valor: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(valor);

/**
 * registrarMovimiento: agrega un objeto de transacción al historial de la cuenta.
 * @param tipo    - "retiro", "consignacion" o "transferencia"
 * @param monto   - cantidad de dinero de la operación
 * @param detalle - descripción opcional del movimiento
 */
const registrarMovimiento = (
  tipo: TipoMovimiento,
  monto: number,
  detalle: string = ''
): void => {
  const movimiento: Movimiento = {
    tipo,
    monto,
    detalle,
    fecha: new Date().toLocaleString('es-CO'),
  };
  // TypeScript sabe que cuentaActiva no es null aquí porque solo
  // llamamos a esta función cuando ya hay una sesión activa
  cuentaActiva!.movimientos.push(movimiento);
};

// ── OPERACIONES BANCARIAS ─────────────────────────────────────

/**
 * consultarSaldo: muestra el saldo actual y los últimos movimientos.
 */
const consultarSaldo = (): void => {
  if (!cuentaActiva) return;

  console.log(`\n  Titular : ${cuentaActiva.titular}`);
  console.log(`  Cuenta  : ${cuentaActiva.numero}`);
  console.log(`  Saldo   : ${formatPesos(cuentaActiva.saldo)}`);

  if (cuentaActiva.movimientos.length === 0) {
    console.log("  Sin movimientos registrados.");
    return;
  }

  console.log("\n  Últimos movimientos:");

  cuentaActiva.movimientos
    .slice(-5)
    .map((m: Movimiento) =>
      `  ${m.fecha} | ${m.tipo.toUpperCase().padEnd(14)} | ${formatPesos(m.monto)} ${m.detalle}`
    )
    .forEach((l: string) => console.log(l));
};

/**
 * retirar: descuenta un monto del saldo si hay fondos suficientes.
 * @param monto - cantidad a retirar
 */
const retirar = (monto: number): void => {
  if (!cuentaActiva) return;
  if (monto <= 0)                  { console.log("  ⚠  Monto inválido."); return; }
  if (monto > cuentaActiva.saldo)  { console.log("  ⚠  Saldo insuficiente."); return; }

  cuentaActiva.saldo -= monto;
  registrarMovimiento("retiro", monto);
  console.log(`  ✔  Retiro exitoso. Nuevo saldo: ${formatPesos(cuentaActiva.saldo)}`);
};

/**
 * consignar: suma un monto al saldo de la cuenta.
 * @param monto - cantidad a consignar
 */
const consignar = (monto: number): void => {
  if (!cuentaActiva) return;
  if (monto <= 0) { console.log("  ⚠  Monto inválido."); return; }

  cuentaActiva.saldo += monto;
  registrarMovimiento("consignacion", monto);
  console.log(`  ✔  Consignación exitosa. Nuevo saldo: ${formatPesos(cuentaActiva.saldo)}`);
};

/**
 * transferir: mueve dinero desde la cuenta activa hacia otra cuenta.
 * @param numeroCuentaDestino - número de la cuenta receptora
 * @param monto               - cantidad a transferir
 */
const transferir = (numeroCuentaDestino: string, monto: number): void => {
  if (!cuentaActiva) return;

  const destino: Cuenta | undefined = cuentas.find(c => c.numero === numeroCuentaDestino);

  if (!destino)                    { console.log("  ⚠  Cuenta destino no encontrada."); return; }
  if (destino === cuentaActiva)    { console.log("  ⚠  No puedes transferir a tu propia cuenta."); return; }
  if (monto <= 0)                  { console.log("  ⚠  Monto inválido."); return; }
  if (monto > cuentaActiva.saldo)  { console.log("  ⚠  Saldo insuficiente."); return; }

  cuentaActiva.saldo -= monto;
  registrarMovimiento("transferencia", monto, `→ ${destino.titular}`);

  destino.saldo += monto;
  const movimientoDestino: Movimiento = {
    tipo: "transferencia recibida",
    monto,
    detalle: `← ${cuentaActiva.titular}`,
    fecha: new Date().toLocaleString('es-CO'),
  };
  destino.movimientos.push(movimientoDestino);

  console.log(`  ✔  Transferencia de ${formatPesos(monto)} a ${destino.titular} exitosa.`);
  console.log(`     Tu nuevo saldo: ${formatPesos(cuentaActiva.saldo)}`);
};

// ── AUTENTICACIÓN ─────────────────────────────────────────────

/**
 * iniciarSesion: verifica número de cuenta y PIN antes de dar acceso.
 * @param rl       - instancia de readline
 * @param callback - función a ejecutar con el resultado del login
 */
const iniciarSesion = (
  rl: readline.Interface,
  callback: (exito: boolean) => void
): void => {
  rl.question("\n  Número de cuenta: ", (numeroCuenta: string) => {
    const cuenta: Cuenta | undefined = cuentas.find(c => c.numero === numeroCuenta.trim());

    if (!cuenta) {
      console.log("  ⚠  Cuenta no encontrada.");
      return callback(false);
    }

    rl.question("  PIN: ", (pin: string) => {
      if (pin.trim() !== cuenta.pin) {
        console.log("  ⚠  PIN incorrecto.");
        return callback(false);
      }

      cuentaActiva = cuenta;
      console.log(`\n  ✔  Bienvenido/a, ${cuentaActiva.titular}`);
      callback(true);
    });
  });
};

// ── INTERFAZ readline ─────────────────────────────────────────

const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menuCajero = (): void => {
  console.log("\n─── CAJERO AUTOMÁTICO ──────────────────────");
  console.log(" 1. Consultar saldo");
  console.log(" 2. Retirar");
  console.log(" 3. Consignar");
  console.log(" 4. Transferir");
  console.log(" 5. Cerrar sesión");
  console.log("────────────────────────────────────────────");

  rl.question(" Opción: ", (opcion: string) => {
    switch (opcion.trim()) {

      case "1":
        consultarSaldo();
        menuCajero();
        break;

      case "2":
        rl.question("  Monto a retirar: $", (monto: string) => {
          retirar(Number(monto));
          menuCajero();
        });
        break;

      case "3":
        rl.question("  Monto a consignar: $", (monto: string) => {
          consignar(Number(monto));
          menuCajero();
        });
        break;

      case "4":
        rl.question("  Cuenta destino: ", (destino: string) => {
          rl.question("  Monto: $", (monto: string) => {
            transferir(destino.trim(), Number(monto));
            menuCajero();
          });
        });
        break;

      case "5":
        // En este punto cuentaActiva no puede ser null (el usuario está en el menú)
        console.log(`\n  Sesión cerrada. ¡Hasta pronto, ${cuentaActiva!.titular}!\n`);
        cuentaActiva = null;
        rl.close();
        break;

      default:
        console.log("  Opción inválida.");
        menuCajero();
    }
  });
};

// ── INICIO DEL PROGRAMA ───────────────────────────────────────

console.log("\n════════════════════════════════════════════");
console.log("          CAJERO AUTOMÁTICO");
console.log("════════════════════════════════════════════");
console.log(" Cuentas de prueba:");
console.log("   001-2024  PIN: 1234");
console.log("   002-2024  PIN: 5678");
console.log("────────────────────────────────────────────");

iniciarSesion(rl, (exito: boolean) => {
  if (exito) menuCajero();
  else rl.close();
});