// =====================
// INTERFACES
// =====================

interface Lavadora {
  id: number;
  disponible: boolean;
}

interface Alquiler {
  id: number;
  cliente: string;
  lavadoraId: number;
  horas: number;
  precio: number;
  descuento: number;
}

// =====================
// CLASE
// =====================

class Lavanderia {
  private lavadoras: Lavadora[] = [];
  private alquileres: Alquiler[] = [];
  private idAlquiler: number = 1;

  constructor(cantidad: number) {
    for (let i = 1; i <= cantidad; i++) {
      this.lavadoras.push({ id: i, disponible: true });
    }
  }

  private calcularDescuento(horas: number): number {
    if (horas >= 9) return 0.3;
    if (horas >= 5) return 0.2;
    if (horas >= 3) return 0.1;
    return 0;
  }

  alquilar(cliente: string, horas: number) {
    const lavadora = this.lavadoras.find(l => l.disponible);

    if (!lavadora) {
      console.log("No hay lavadoras disponibles");
      return;
    }

    lavadora.disponible = false;

    const descuento = this.calcularDescuento(horas);
    const precio = horas * 2 * (1 - descuento);

    this.alquileres.push({
      id: this.idAlquiler++,
      cliente,
      lavadoraId: lavadora.id,
      horas,
      precio,
      descuento
    });
  }

  devolver(lavadoraId: number) {
    const lavadora = this.lavadoras.find(l => l.id === lavadoraId);
    if (lavadora) lavadora.disponible = true;
  }

  reporte() {
    const total = this.alquileres.reduce((acc, a) => acc + a.precio, 0);

    const disponibles = this.lavadoras.filter(l => l.disponible).length;

    const descuentosAltos = this.alquileres.filter(a => a.descuento >= 0.2);

    return {
      totalRecaudado: total,
      disponibles,
      alquileresConDescuentoMayor20: descuentosAltos
    };
  }
}

// PRUEBA
const lavanderia = new Lavanderia(5);

lavanderia.alquilar("Steve", 2);
lavanderia.alquilar("Dei", 6);
lavanderia.devolver(1);

console.log(lavanderia.reporte());