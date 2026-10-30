export function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
}

export function manejadorErrores(err, req, res, next) {

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ mensaje: "El cuerpo de la petición no es un JSON válido" });
  }
  console.error(err);
  res.status(500).json({ mensaje: "Error interno del servidor" });
}
