import { useState } from 'react';
import { Container } from 'reactstrap';
import Home from './auth/Home';
import Inventario from './Inventario';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [avisoHome, setAvisoHome] = useState('');

  function iniciarSesion(nombre) {
    setUsuario(nombre);
    setAvisoHome('');
  }

  function tiempoAgotado() {
    setUsuario(null);
    setAvisoHome(
      'Se acabó la ventana de lanzamiento. La carga fue reiniciada; inicia sesión de nuevo.'
    );
  }

  if (usuario === null) {
    return <Home onLogin={iniciarSesion} aviso={avisoHome} />;
  }

  return (
    <Container className="my-4">
      <Inventario onTiempoAgotado={tiempoAgotado} />
    </Container>
  );
}

export default App;