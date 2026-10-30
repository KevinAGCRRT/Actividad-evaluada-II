
import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from 'reactstrap';
import { USUARIO_VALIDO, CLAVE_VALIDA } from '../config';

function Home({ onLogin, aviso }) {
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  function enviar(evento) {
    evento.preventDefault(); 

    if (nombre.trim() === USUARIO_VALIDO && clave === CLAVE_VALIDA) {
      setError('');
      onLogin(nombre.trim()); 
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md="6" lg="4" xs="12">
          <h1 className="h3 text-center mb-4">Evaluación II – Programación Web</h1>

          
          {aviso && <Alert color="info">{aviso}</Alert>}

          <Card>
            <CardBody>
              <CardTitle tag="h2" className="h5 mb-3">Iniciar sesión</CardTitle>
              <Form onSubmit={enviar}>
                <FormGroup>
                  <Label for="usuario">Usuario</Label>
                  <Input
                    id="usuario"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="clave">Contraseña</Label>
                  <Input
                    id="clave"
                    type="password"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </FormGroup>
                {error && <Alert color="danger">{error}</Alert>}
                <Button color="primary" type="submit" block>
                  Entrar
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
