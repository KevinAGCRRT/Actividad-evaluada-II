
import { Router } from "express";
import { inventario, itemsCargados, reiniciarEstado } from "./data.js";
import {
  parseId,
  esCantidadValida,
  buscarSuministro,
  buscarItemCarga,
  alcanzanCreditos,
  cabePeso,
  construirCarga,
} from "./helpers.js";

const router = Router();

const responderError = (res, estado, mensaje) => res.status(estado).json({ mensaje });

const estadoActual = () => ({ carga: construirCarga(), inventario });

// --GET-inventario --
router.get("/inventario", (req, res) => {
  res.json(inventario);
});

// --GET-carga--
router.get("/carga", (req, res) => {
  res.json(construirCarga());
});

// --POST-carga-agregar--
router.post("/carga/agregar", (req, res) => {
  const { equipoId, cantidad } = req.body ?? {};

  const id = parseId(equipoId);
  if (id === null) return responderError(res, 400, "El id del suministro no es válido");
  if (!esCantidadValida(cantidad)) {
    return responderError(res, 400, "La cantidad debe ser un número entero mayor a 0");
  }

  const suministro = buscarSuministro(id);
  if (!suministro) return responderError(res, 404, "El suministro no existe");

  if (suministro.stock < cantidad) return responderError(res, 400, "Stock en base insuficiente");
  if (!cabePeso(suministro.peso * cantidad)) {
    return responderError(res, 400, "Peso máximo del transbordador excedido");
  }
  if (!alcanzanCreditos(suministro.precio * cantidad)) {
    return responderError(res, 400, "Créditos insuficientes para esta cantidad");
  }
  
  suministro.stock -= cantidad;
  const itemExistente = buscarItemCarga(id);
  if (itemExistente) {
    itemExistente.cantidad += cantidad; // ya estaba en la nave: se suman unidades
  } else {
    itemsCargados.push({ id, cantidad });
  }

  res.status(200).json(estadoActual());
});

// ---PUT---
// Body: { cantidad: 3 }  -> es la NUEVA cantidad total (no un incremento).
router.put("/carga/actualizar-unidades/:id", (req, res) => {
  const id = parseId(req.params.id); // el :id llega como texto
  if (id === null) return responderError(res, 400, "El id del suministro no es válido");

  const { cantidad } = req.body ?? {};
  if (!esCantidadValida(cantidad)) {
    return responderError(
      res,
      400,
      "La cantidad debe ser un número entero mayor a 0. Para quitar el suministro usa Desembarcar"
    );
  }

  const item = buscarItemCarga(id);
  if (!item) return responderError(res, 404, "Ese suministro no está en la carga");
  const suministro = buscarSuministro(id);

  // Positiva = se suben unidades (salen del stock). Negativa = se bajan (vuelven al stock).
  const diferencia = cantidad - item.cantidad;

  if (diferencia > suministro.stock) return responderError(res, 400, "Stock en base insuficiente");
  if (!cabePeso(diferencia * suministro.peso)) {
    return responderError(res, 400, "Peso máximo del transbordador excedido");
  }
  if (!alcanzanCreditos(diferencia * suministro.precio)) {
    return responderError(res, 400, "Créditos insuficientes para esta cantidad");
  }

  suministro.stock -= diferencia; // con diferencia negativa, el stock sube
  item.cantidad = cantidad;

  res.status(200).json(estadoActual());
});

// --DELETE--
router.delete("/carga/eliminar/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return responderError(res, 400, "El id del suministro no es válido");

  const posicion = itemsCargados.findIndex((i) => i.id === id);
  if (posicion === -1) return responderError(res, 404, "Ese suministro no está en la carga");

  const suministro = buscarSuministro(id);
  suministro.stock += itemsCargados[posicion].cantidad; // devuelve las unidades a la base
  itemsCargados.splice(posicion, 1); // quita el ítem de la carga

  res.status(200).json(estadoActual());
});

// --POST reiniciar--
router.post("/carga/reiniciar", (req, res) => {
  reiniciarEstado();
  res.status(200).json(estadoActual());
});

export default router;
