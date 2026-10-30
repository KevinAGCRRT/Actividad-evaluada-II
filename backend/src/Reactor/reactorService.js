function generarTemperaturaAleatoria() {
  return Math.floor(Math.random() * 100) + 1;
}

let temperaturaObjetivo = generarTemperaturaAleatoria();

export function ajustarTemperatura(temperaturaIngresada) {
  if (temperaturaIngresada < temperaturaObjetivo) {
    return {
      resultado: 'más alta',
      estabilizado: false,
      mensaje: 'La temperatura ideal del reactor es más alta.',
    };
  }

  if (temperaturaIngresada > temperaturaObjetivo) {
    return {
      resultado: 'más baja',
      estabilizado: false,
      mensaje: 'La temperatura ideal del reactor es más baja.',
    };
  }

  return {
    resultado: 'estabilizado',
    estabilizado: true,
    mensaje: '¡Reactor estabilizado correctamente!',
  };
}

export function reiniciarReactor() {
  temperaturaObjetivo = generarTemperaturaAleatoria();

  return {
    estabilizado: false,
    mensaje: 'Sistema reiniciado. Se ha generado una nueva temperatura de estabilización.',
  };
}

