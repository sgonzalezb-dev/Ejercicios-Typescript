# 🧠 Ejercicios en TypeScript

Este repositorio contiene la solución de múltiples ejercicios prácticos desarrollados en TypeScript, enfocados en lógica de programación, estructuras de datos, programación funcional y buenas prácticas.

---

## 📁 Estructura del proyecto

```
/
├── src/
│   ├── banco.ts
│   ├── cajero.ts
│   ├── cajeroautomatico.ts
│   ├── carrito.ts
│   ├── cine.ts
│   ├── digiturno.ts
│   ├── estadio.ts
│   ├── lavadoras.ts
│   ├── sistemah.ts
│   └── index.ts
│
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## 🧠 Descripción de los ejercicios

| Archivo             | Descripción                                    |
| ------------------- | ---------------------------------------------- |
| banco.ts            | Sistema de cuentas bancarias                   |
| cajero.ts           | Simulación básica de cajero                    |
| cajeroautomatico.ts | Cajero completo con historial de transacciones |
| carrito.ts          | Sistema de compras con carrito                 |
| cine.ts             | Venta de boletas con control de asientos       |
| digiturno.ts        | Sistema de turnos (FIFO)                       |
| estadio.ts          | Reservas por zonas                             |
| lavadoras.ts        | Alquiler de lavadoras por horas                |
| sistemah.ts         | Sistema de hotel con reservas y descuentos     |

---

## 🛠️ Requisitos

* Node.js v18+
* npm

---

## 📦 Instalación

```bash
npm install
```

---

## ▶️ Ejecución

### Ejecutar todo el sistema

```bash
npx ts-node src/index.ts
```

### Ejecutar un archivo específico

```bash
npx ts-node src/cajeroautomatico.ts
npx ts-node src/cine.ts
```

---

## ⚙️ Tecnologías utilizadas

* TypeScript
* Node.js
* ts-node

---

## 🧠 Buenas prácticas implementadas

* Tipado estricto
* Modularidad (archivos separados)
* Validaciones de datos
* Manejo de estados (disponible/ocupado)
* Programación funcional:

  * map()
  * filter()
  * reduce()

---

## 🚫 Notas importantes

* No se incluye `node_modules`
* Se usa `.gitignore` para mantener limpio el repositorio

---

## 👨‍💻 Autor

Steven González

---
