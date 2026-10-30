
import { useState } from 'react';
import { Container } from 'reactstrap';
import Home from './auth/Home';
import BarraNavegacion from './components/BarraNavegacion';
import Reactor from './reactor/Reactor';
import Inventario from './astrologistics/Inventario';

function App() {
  
  const [usuario, setUsuario] = useState(null);
  const [vistaActiva, setVistaActiva] = useState('reactor');
  const [avisoHome, setAvisoHome] = useState('');

  function iniciarSesion(nombre) {
    setUsuario(nombre);
    setVistaActiva('reactor');
    setAvisoHome('');
  }

  function cerrarSesion() {
    setUsuario(null);
  }

  
  function tiempoAgotado() {
    setUsuario(null);
    setAvisoHome('Se acabó la ventana de lanzamiento. La carga fue reiniciada; inicia sesión de nuevo.');
  }

  
  if (usuario === null) {
    return <Home onLogin={iniciarSesion} aviso={avisoHome} />;
  }

  return (
    <>
      <BarraNavegacion
        usuario={usuario}
        vistaActiva={vistaActiva}
        onCambiarVista={setVistaActiva}
        onCerrarSesion={cerrarSesion}
      />
      <Container className="my-4">
        {vistaActiva === 'reactor' && <Reactor />}
        {vistaActiva === 'inventario' && <Inventario onTiempoAgotado={tiempoAgotado} />}
      </Container>
    </>
  );
}

export default App;
