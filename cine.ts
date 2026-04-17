// =====================
// INTERFACES
// =====================

type TipoBoleta = "adulto" | "estudiante" | "niño";

interface Pelicula {
  id: number;
  titulo: string;
  genero: string;
  duracion: number;
  horarios: string[];
}

interface Venta {
  peliculaId: number;
  horario: string;
  tipo: TipoBoleta;
  cantidad: number;
  total: number;
}

// =====================
// CLASE
// =====================

class Cine {
  private peliculas: Pelicula[] = [
    { id: 1, titulo: "Avengers", genero: "Acción", duracion: 120, horarios: ["18:00", "21:00"] },
    { id: 2, titulo: "Batman", genero: "Drama", duracion: 110, horarios: ["17:00", "20:00"] },
    { id: 3, titulo: "Mario", genero: "Animación", duracion: 90, horarios: ["16:00", "19:00"] }
  ];

  private ventas: Venta[] = [];

  private precios = {
    adulto: 10,
    estudiante: 7,
    niño: 5
  };

  vender(peliculaId: number, horario: string, tipo: TipoBoleta, cantidad: number) {
    const pelicula = this.peliculas.find(p => p.id === peliculaId);
    if (!pelicula) {
      console.log("Película no existe");
      return;
    }

    if (!pelicula.horarios.includes(horario)) {
      console.log("Horario inválido");
      return;
    }

    const vendidos = this.ventas
      .filter(v => v.peliculaId === peliculaId && v.horario === horario)
      .reduce((acc, v) => acc + v.cantidad, 0);

    if (vendidos + cantidad > 100) {
      console.log("No hay suficientes asientos");
      return;
    }

    const total = this.precios[tipo] * cantidad;

    this.ventas.push({
      peliculaId,
      horario,
      tipo,
      cantidad,
      total
    });
  }

  reporte() {
    const ingresos = this.ventas.reduce((acc, v) => acc + v.total, 0);

    const ocupacion = this.peliculas.map(p => {
      const totalVendidos = this.ventas
        .filter(v => v.peliculaId === p.id)
        .reduce((acc, v) => acc + v.cantidad, 0);

      const porcentaje = (totalVendidos / (100 * p.horarios.length)) * 100;

      return {
        pelicula: p.titulo,
        ocupacion: porcentaje
      };
    });

    const populares = ocupacion.filter(p => p.ocupacion >= 70);

    return {
      ingresosTotales: ingresos,
      ocupacion,
      peliculasPopulares: populares
    };
  }
}

// PRUEBA
const cine = new Cine();

cine.vender(1, "18:00", "adulto", 50);
cine.vender(1, "18:00", "niño", 30);
cine.vender(2, "20:00", "estudiante", 70);

console.log(cine.reporte());