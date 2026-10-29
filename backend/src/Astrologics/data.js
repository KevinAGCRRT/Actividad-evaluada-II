// Presupuesto de misión 
export const PRESUPUESTO_INICIAL = 500;

// Peso máximo que soporta el transbordador (kg).
export const PESO_MAXIMO = 250;

// Datos del inventario
const INVENTARIO_INICIAL = [
  { id: 201, nombre: "Tanque de Oxígeno XL", precio: 50.0, peso: 25, stock: 5, categoria: "Soporte Vital" },
  { id: 202, nombre: "Ración de Comida Liofilizada", precio: 15.0, peso: 2, stock: 20, categoria: "Alimentación" },
  { id: 203, nombre: "Panel Solar Plegable", precio: 120.0, peso: 30, stock: 3, categoria: "Energía" },
  { id: 204, nombre: "Kit de Primeros Auxilios", precio: 35.5, peso: 3, stock: 8, categoria: "Medicina" },
  { id: 205, nombre: "Traje EVA Reforzado", precio: 200.0, peso: 40, stock: 2, categoria: "Equipo" },
  { id: 206, nombre: "Filtro de Agua Orbital", precio: 40.0, peso: 15, stock: 0, categoria: "Soporte Vital" },
  { id: 207, nombre: "Batería de Litio Espacial", precio: 75.25, peso: 12, stock: 6, categoria: "Energía" },
];

export const inventario = structuredClone(INVENTARIO_INICIAL);

//arreglo de los items 
export const itemsCargados = [];

//funcion para reiniciar inventario
export function reiniciarEstado() {
  inventario.length = 0;
  inventario.push(...structuredClone(INVENTARIO_INICIAL));
  itemsCargados.length = 0;
}
