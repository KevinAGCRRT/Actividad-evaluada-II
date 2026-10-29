//Heplers para el programa :)
import { inventario, itemsCargados, PRESUPUESTO_INICIAL, PESO_MAXIMO } from "./data.js";


export const redondear = (numero) => Math.round(numero * 100) / 100;

export function parseId(valor) {
  if (typeof valor !== "string" && typeof valor !== "number") return null;
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}


export const esCantidadValida = (cantidad) => Number.isInteger(cantidad) && cantidad > 0;

export const buscarSuministro = (id) => inventario.find((s) => s.id === id);
export const buscarItemCarga = (id) => itemsCargados.find((i) => i.id === id);


export function calcularTotal() {
  const total = itemsCargados.reduce((acumulado, item) => {
    const suministro = buscarSuministro(item.id);
    return acumulado + suministro.precio * item.cantidad;
  }, 0);
  return redondear(total);
}


export function alcanzanCreditos(costoExtra) {
  return redondear(calcularTotal() + costoExtra) <= PRESUPUESTO_INICIAL;
}


export function calcularPesoTotal() {
  const peso = itemsCargados.reduce((acumulado, item) => {
    const suministro = buscarSuministro(item.id);
    return acumulado + suministro.peso * item.cantidad;
  }, 0);
  return redondear(peso);
}


export function cabePeso(pesoExtra) {
  return redondear(calcularPesoTotal() + pesoExtra) <= PESO_MAXIMO;
}


export function construirCarga() {
  const total = calcularTotal();
  return {
    creditos: redondear(PRESUPUESTO_INICIAL - total),
    itemsCargados,
    total,
    pesoTotal: calcularPesoTotal(),
    pesoMaximo: PESO_MAXIMO,
  };
}

