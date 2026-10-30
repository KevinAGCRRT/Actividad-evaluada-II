import { useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  ListGroup,
  ListGroupItem,
  Badge,
} from 'reactstrap';
import { API_URL } from '../config';

function Reactor() {
  const [temperatura, setTemperatura] = useState('');
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [estabilizado, setEstabilizado] = useState(false);

  async function enviarAjuste(evento) {
    evento.preventDefault();

    try {
      const respuesta = await fetch(`${API_URL}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperatura: Number(temperatura) }),
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje);
        return;
      }

      setMensaje(datos.mensaje);
      setEstabilizado(datos.estabilizado);
      if (!datos.estabilizado) {
        setHistorial([...historial, { valor: Number(temperatura), resultado: datos.resultado }]);
      }
      setTemperatura('');
    } catch {
      setMensaje('No se pudo conectar con el servidor.');
    }
  }

  async function reiniciar() {
    try {
      const respuesta = await fetch(`${API_URL}/reboot`, { method: 'POST' });
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje);
        return;
      }

      setMensaje(datos.mensaje);
      setEstabilizado(false);
      setHistorial([]);
      setTemperatura('');
    } catch {
      setMensaje('No se pudo conectar con el servidor.');
    }
  }

  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle tag="h2">Ejercicio 1: Estabiliza el Reactor</CardTitle>
        <p className="text-muted">Adivina la temperatura ideal del reactor (entre 1 y 100).</p>

        <Form onSubmit={enviarAjuste}>
          <FormGroup>
            <Label for="temperatura">Temperatura</Label>
            <Input
              id="temperatura"
              type="number"
              min="1"
              max="100"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
              disabled={estabilizado}
              required
            />
          </FormGroup>
          <Button color="primary" type="submit" disabled={estabilizado}>
            Ajustar temperatura
          </Button>{' '}
          <Button color="secondary" outline type="button" onClick={reiniciar}>
            Reiniciar reactor
          </Button>
        </Form>

        {mensaje && (
          <Alert color={estabilizado ? 'success' : 'warning'} className="mt-3">
            {mensaje}
          </Alert>
        )}

        <h5 className="mt-4">Intentos fallidos ({historial.length})</h5>
        {historial.length === 0 ? (
          <p className="text-muted">Todavía no has ingresado ninguna temperatura.</p>
        ) : (
          <ListGroup>
            {historial.map((intento, indice) => (
              <ListGroupItem key={indice} className="d-flex justify-content-between">
                <span>
                  Intento {indice + 1}: <strong>{intento.valor}°</strong>
                </span>
                <Badge color="secondary" pill>
                  {intento.resultado}
                </Badge>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </CardBody>
    </Card>
  );
}

export default Reactor;
