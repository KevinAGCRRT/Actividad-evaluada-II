import * as reactorService from './reactorService.js';

export function ajustar(req, res, next) {
  try {

    const datoRecibido = (req.body ?? {}).temperatura;
    const temperaturaIngresada = Number(datoRecibido);

    if (
      datoRecibido === undefined ||
      datoRecibido === '' ||
      Number.isNaN(temperaturaIngresada) ||
      temperaturaIngresada < 1 ||
      temperaturaIngresada > 100
    ) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Debes enviar una temperatura numérica válida entre 1 y 100.',
      });
    }

    const datos = reactorService.ajustarTemperatura(temperaturaIngresada);

    return res.status(200).json({
      estado: 'éxito',
      ...datos,
    });
  } catch (error) {
    return next(error);
  }
}

export function reiniciar(req, res, next) {
  try {
    const datos = reactorService.reiniciarReactor();

    return res.status(200).json({
      estado: 'éxito',
      ...datos,
    });
  } catch (error) {
    return next(error);
  }
}

