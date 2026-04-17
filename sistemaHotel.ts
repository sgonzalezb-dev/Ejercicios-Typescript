// =====================
// TIPOS E INTERFACES
// =====================

type TipoHabitacion = "economica" | "estandar" | "suite";

interface Habitacion {
  id: number;
  tipo: TipoHabitacion;
  disponible: boolean;
}

interface Reserva {
  id: number;
  cliente: string;
  tipo: TipoHabitacion;
  noches: number;
  precioBase: number;
  descuento: number;
  precioFinal: number;
}

// =====================
// CLASE HOTEL
// =====================

class Hotel {
  private habitaciones: Habitacion[] = [];
  private reservas: Reserva[] = [];
  private idReserva: number = 1;

  // Tarifas
  private tarifas = {
    economica: 80,
    estandar: 150,
    suite: 300
  };

  constructor() {
    // Crear habitaciones (ejemplo: 3 por tipo)
    let id = 1;
    ["economica", "estandar", "suite"].forEach((tipo: any) => {
      for (let i = 0; i < 3; i++) {
        this.habitaciones.push({
          id: id++,
          tipo,
          disponible: true
        });
      }
    });
  }

  // =====================
  // DESCUENTOS
  // =====================

  private calcularDescuento(noches: number): number {
    if (noches >= 11) return 0.15;
    if (noches >= 6) return 0.10;
    if (noches >= 3) return 0.05;
    return 0;
  }

  // =====================
  // CREAR RESERVA
  // =====================

  crearReserva(cliente: string, tipo: TipoHabitacion, noches: number) {
    // Validar tipo
    if (!this.tarifas[tipo]) {
      console.log("Tipo de habitación inválido");
      return;
    }

    // Buscar habitación disponible
    const habitacion = this.habitaciones.find(
      h => h.tipo === tipo && h.disponible
    );

    if (!habitacion) {
      console.log("No hay habitaciones disponibles");
      return;
    }

    // Marcar como ocupada
    habitacion.disponible = false;

    const tarifa = this.tarifas[tipo];
    const descuento = this.calcularDescuento(noches);

    const precioBase = tarifa * noches;
    const precioFinal = precioBase * (1 - descuento);

    const reserva: Reserva = {
      id: this.idReserva++,
      cliente,
      tipo,
      noches,
      precioBase,
      descuento,
      precioFinal
    };

    this.reservas.push(reserva);
  }

  // =====================
  // REPORTES
  // =====================

  generarReporte() {
    // map() → transformar datos
    const resumenReservas = this.reservas.map(r =>
      `Cliente: ${r.cliente} | ${r.tipo} | Noches: ${r.noches} | Total: $${r.precioFinal}`
    );

    // ingresos totales
    const ingresosTotales = this.reservas.reduce(
      (acc, r) => acc + r.precioFinal,
      0
    );

    // ingresos por tipo (filter + reduce)
    const ingresosPorTipo = ["economica", "estandar", "suite"].map(tipo => {
      const total = this.reservas
        .filter(r => r.tipo === tipo)
        .reduce((acc, r) => acc + r.precioFinal, 0);

      return { tipo, total };
    });

    // descuentos totales
    const descuentosTotales = this.reservas.reduce(
      (acc, r) => acc + (r.precioBase - r.precioFinal),
      0
    );

    // ocupación
    const ocupadas = this.habitaciones.filter(h => !h.disponible).length;
    const totalHabitaciones = this.habitaciones.length;

    const porcentajeOcupacion =
      (ocupadas / totalHabitaciones) * 100;

    return {
      resumenReservas,
      ingresosTotales,
      ingresosPorTipo,
      descuentosTotales,
      ocupacion: `${porcentajeOcupacion.toFixed(2)}%`
    };
  }
}

// =====================
// PRUEBA DEL SISTEMA
// =====================

const hotel = new Hotel();

// Crear reservas
hotel.crearReserva("Steeven", "economica", 2);
hotel.crearReserva("Dei", "suite", 7);
hotel.crearReserva("Carlos", "estandar", 12);
hotel.crearReserva("Ana", "suite", 3);

// Reporte
console.log("REPORTE DEL HOTEL:");
console.log(hotel.generarReporte());