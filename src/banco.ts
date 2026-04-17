// =====================
// INTERFACES
// =====================

interface Cliente {
  turno: number;
  llegada: number;
  inicio?: number;
  fin?: number;
  estado: "esperando" | "atendido";
}

// =====================
// CLASE
// =====================

class FilaBanco {
  private cola: Cliente[] = [];
  private turnoActual: number = 1;

  // Llegada
  llegar() {
    this.cola.push({
      turno: this.turnoActual++,
      llegada: Date.now(),
      estado: "esperando"
    });
  }

  // FIFO
  atender() {
    const cliente = this.cola.find(c => c.estado === "esperando");
    if (!cliente) return;

    cliente.estado = "atendido";
    cliente.inicio = Date.now();

    // Simulación tiempo atención
    cliente.fin = cliente.inicio + Math.floor(Math.random() * 5000);
  }

  estadisticas() {
    const esperando = this.cola.filter(c => c.estado === "esperando");

    const atendidos = this.cola.filter(c => c.estado === "atendido");

    const promedioEspera =
      atendidos.reduce((acc, c) => acc + (c.inicio! - c.llegada), 0) /
      (atendidos.length || 1);

    const promedioAtencion =
      atendidos.reduce((acc, c) => acc + (c.fin! - c.inicio!), 0) /
      (atendidos.length || 1);

    return {
      enEspera: esperando.length,
      atendidos: atendidos.length,
      promedioEspera,
      promedioAtencion
    };
  }
}

// PRUEBA
const fila = new FilaBanco();

fila.llegar();
fila.llegar();
fila.atender();
fila.atender();

console.log(fila.estadisticas());