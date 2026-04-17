// =====================
// TIPOS E INTERFACES
// =====================

type TipoOperacion = "deposito" | "retiro";

interface Transaccion {
  id: number;
  tipo: TipoOperacion;
  monto: number;
  fecha: Date;
  saldoResultante: number;
}

interface CuentaBancaria {
  titular: string;
  saldo: number;
  transacciones: Transaccion[];
}

// =====================
// CLASE BANCO
// =====================

class Banco {
  private cuentas: CuentaBancaria[] = [];
  private contadorId: number = 1;

  // Crear cuenta
  crearCuenta(titular: string, saldoInicial: number): void {
    const nuevaCuenta: CuentaBancaria = {
      titular,
      saldo: saldoInicial,
      transacciones: []
    };

    this.cuentas.push(nuevaCuenta);
  }

  // Buscar cuenta
  private obtenerCuenta(titular: string): CuentaBancaria | undefined {
    return this.cuentas.find(c => c.titular === titular);
  }

  // =====================
  // OPERACIONES
  // =====================

  consultarSaldo(titular: string): number | void {
    const cuenta = this.obtenerCuenta(titular);
    if (!cuenta) {
      console.log("Cuenta no encontrada");
      return;
    }

    return cuenta.saldo;
  }

  depositar(titular: string, monto: number): void {
    const cuenta = this.obtenerCuenta(titular);

    if (!cuenta) {
      console.log("Cuenta no encontrada");
      return;
    }

    if (monto <= 0) {
      console.log("Monto inválido");
      return;
    }

    cuenta.saldo += monto;

    this.registrarTransaccion(cuenta, "deposito", monto);
  }

  retirar(titular: string, monto: number): void {
    const cuenta = this.obtenerCuenta(titular);

    if (!cuenta) {
      console.log("Cuenta no encontrada");
      return;
    }

    if (monto > cuenta.saldo) {
      console.log("Fondos insuficientes");
      return;
    }

    cuenta.saldo -= monto;

    this.registrarTransaccion(cuenta, "retiro", monto);
  }

  // =====================
  // REGISTRO INTERNO
  // =====================

  private registrarTransaccion(
    cuenta: CuentaBancaria,
    tipo: TipoOperacion,
    monto: number
  ) {
    const transaccion: Transaccion = {
      id: this.contadorId++,
      tipo,
      monto,
      fecha: new Date(),
      saldoResultante: cuenta.saldo
    };

    cuenta.transacciones.push(transaccion);
  }

  // =====================
  // ESTADO DE CUENTA
  // =====================

  estadoCuenta(titular: string) {
    const cuenta = this.obtenerCuenta(titular);

    if (!cuenta) {
      console.log("Cuenta no encontrada");
      return;
    }

    // map() → formatear
    const historial = cuenta.transacciones.map(t =>
      `ID:${t.id} | ${t.tipo.toUpperCase()} | $${t.monto} | Saldo: $${t.saldoResultante}`
    );

    // filter() + reduce()
    const totalDepositos = cuenta.transacciones
      .filter(t => t.tipo === "deposito")
      .reduce((acc, t) => acc + t.monto, 0);

    const totalRetiros = cuenta.transacciones
      .filter(t => t.tipo === "retiro")
      .reduce((acc, t) => acc + t.monto, 0);

    return {
      titular: cuenta.titular,
      saldoActual: cuenta.saldo,
      historial,
      totalDepositos,
      totalRetiros
    };
  }
}

// =====================
// PRUEBA DEL SISTEMA
// =====================

const banco = new Banco();

// Crear cuentas
banco.crearCuenta("Steeven", 1000);
banco.crearCuenta("Dei", 500);

// Operaciones Steeven
banco.depositar("Steeven", 300);
banco.retirar("Steeven", 200);

// Operaciones Dei
banco.depositar("Dei", 200);
banco.retirar("Dei", 1000); // error

// Consultas
console.log("Saldo Steeven:", banco.consultarSaldo("Steeven"));
console.log("Saldo Dei:", banco.consultarSaldo("Dei"));

// Estado de cuenta
console.log("Estado Steeven:");
console.log(banco.estadoCuenta("Steeven"));

console.log("Estado Dei:");
console.log(banco.estadoCuenta("Dei"));