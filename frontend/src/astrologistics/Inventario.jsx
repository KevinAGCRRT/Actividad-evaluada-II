
// Inventario.jsx - Ejercicio 2: AstroLogistics Ltd.

import { useEffect, useState } from 'react';

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Alert,
  UncontrolledAlert,
  Badge,
  ListGroup,
  ListGroupItem,
  ButtonGroup,
} from 'reactstrap';
import { API_URL, TIEMPO_LANZAMIENTO } from '../config';



async function llamarApi(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }

  const datos = await respuesta.json();


  if (!respuesta.ok) {
    throw new Error(datos.mensaje);
  }
  return datos;
}


function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const resto = String(segundos % 60).padStart(2, '0');
  return `${minutos}:${resto}`;
}

function Inventario({ onTiempoAgotado }) {


  const [inventario, setInventario] = useState([]);
  const [aviso, setAviso] = useState(null);
  const [carga, setCarga] = useState(null);
  const [segundosRestantes, setSegundosRestantes] = useState(TIEMPO_LANZAMIENTO);

 

  function mostrarAviso(texto, color = 'warning') {
    setAviso((anterior) => ({ texto, color, id: (anterior?.id ?? 0) + 1 }));
  }

  
  function aplicarEstado(datos) {
    setCarga(datos.carga);
    setInventario(datos.inventario);
  }

  
  // temporizador: resta 1 cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSegundosRestantes((anterior) => (anterior > 0 ? anterior - 1 : 0));
    }, 1000);

    // Limpieza: al salir de la vista se detiene el intervalo
    return () => clearInterval(intervalo);
  }, []);

  
  useEffect(() => {
    if (segundosRestantes !== 0) return;

    async function terminarSesion() {
      try {
        await llamarApi('/api/carga/reiniciar', { method: 'POST' });
      } catch (error) {
        console.error(error.message);
      } finally {
        onTiempoAgotado(); // aunque falle el reinicio, la sesión se cierra
      }
    }
    terminarSesion();
  }, [segundosRestantes, onTiempoAgotado]);


  // FUNCIÓN PARA AGREGAR UN PRODUCTO A LA NAVe
  
  async function agregarProducto(id) {
    try {
      const datos = await llamarApi('/api/carga/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipoId: id, cantidad: 1 }),
      });
      aplicarEstado(datos);
      mostrarAviso('Producto agregado correctamente', 'success');
    } catch (error) {
      mostrarAviso(error.message);
    }
  }

 
  // FUNCIÓN PARA AUMENTAR LA CANTIDAD DE UN PRODUCTO
 
  async function aumentarCantidad(id, cantidadActual) {
    try {
   
      const datos = await llamarApi(`/api/carga/actualizar-unidades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: cantidadActual + 1 }),
      });
      aplicarEstado(datos);
      mostrarAviso('Cantidad actualizada', 'success');
    } catch (error) {
      mostrarAviso(error.message);
    }
  }


  // FUNCIÓN PARA DISMINUIR LA CANTIDAD DE UN PRODUCTO

  async function disminuirCantidad(id, cantidadActual) {
    // Si solo queda 1 unidad no bajamos a 0: para eso está "Desembarcar"
    if (cantidadActual <= 1) {
      mostrarAviso('Para quitar el producto usa Desembarcar');
      return;
    }

    try {
      const datos = await llamarApi(`/api/carga/actualizar-unidades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: cantidadActual - 1 }),
      });
      aplicarEstado(datos);
      mostrarAviso('Cantidad actualizada', 'success');
    } catch (error) {
      mostrarAviso(error.message);
    }
  }


  // FUNCIÓN PARA DESEMBARCAR UN PRODUCTO

  async function desembarcarProducto(id) {
    try {
      const datos = await llamarApi(`/api/carga/eliminar/${id}`, { method: 'DELETE' });
      aplicarEstado(datos);
      mostrarAviso('Producto desembarcado', 'success');
    } catch (error) {
      mostrarAviso(error.message);
    }
  }

 
  // FUNCIÓN PARA OBTENER EL INVENTARIO
  
  async function cargarInventario() {
    try {
      const datos = await llamarApi('/api/inventario');
      setInventario(datos);
    } catch (error) {
      mostrarAviso(error.message);
    }
  }

  
  // FUNCIÓN PARA OBTENER LA CARGA DE LA NAVE

  async function cargarCarga() {
    try {
      const datos = await llamarApi('/api/carga');
      setCarga(datos);
    } catch (error) {
      mostrarAviso(error.message);
    }
  }

 
  useEffect(() => {
    cargarInventario();
    cargarCarga();
  }, []);


  function nombreDe(id) {
    return inventario.find((producto) => producto.id === id)?.nombre ?? `ID ${id}`;
  }

  
  // INTERFAZ
  
  return (
    <>
      
      <h1>AstroLogistics</h1>
      <p>Sistema de carga del transbordador espacial.</p>

      {/* panel superior */}
      <Alert color="info" className="d-flex flex-wrap gap-3 align-items-center">
        <span>
          Créditos disponibles:{' '}
          <Badge color="primary" pill>{carga ? carga.creditos : '—'} Cr</Badge>
        </span>
        <span>
          Costo total de carga:{' '}
          <Badge color="dark" pill>{carga ? carga.total : '—'} Cr</Badge>
        </span>
        <span>
          Peso:{' '}
          <Badge color="secondary" pill>
            {carga ? `${carga.pesoTotal} / ${carga.pesoMaximo} kg` : '—'}
          </Badge>
        </span>
        <span className="ms-auto">
          Ventana de lanzamiento:{' '}
          <Badge color={segundosRestantes <= 30 ? 'danger' : 'success'}>
            {formatearTiempo(segundosRestantes)}
          </Badge>
        </span>
      </Alert>

      
      {aviso && (
        <UncontrolledAlert key={aviso.id} color={aviso.color}>
          {aviso.texto}
        </UncontrolledAlert>
      )}

      <Row>
        {/* catalogo de productoss */}
        <Col lg="8" xs="12">
          <h4>Catálogo de la Base</h4>
          <Row>
            {inventario.map((producto) => (
              <Col md="4" xs="12" className="mb-3" key={producto.id}>
                <Card className="h-100">
                  <CardBody className="d-flex flex-column">
                    <CardTitle tag="h5">{producto.nombre}</CardTitle>
                    <p className="mb-1">ID: {producto.id}</p>
                    <p className="mb-1">Categoría: {producto.categoria}</p>
                    <p className="mb-1">
                      Precio: <Badge color="success">{producto.precio} Cr</Badge>
                    </p>
                    <p className="mb-1">Peso: {producto.peso} kg</p>
                    <p>Stock: {producto.stock}</p>

                    <Button
                      className="mt-auto"
                      color={producto.stock === 0 ? 'secondary' : 'primary'}
                      disabled={producto.stock === 0}
                      onClick={() => agregarProducto(producto.id)}
                    >
                      {producto.stock === 0 ? 'Agotado en Base' : 'Añadir a la Nave'}
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

      
        <Col lg="4" xs="12">
          <h4>Tu Bodega de Carga</h4>
          <ListGroup className="mb-4">
            {carga && carga.itemsCargados.length === 0 && (
              <ListGroupItem className="text-muted">La bodega está vacía.</ListGroupItem>
            )}

            {carga &&
              carga.itemsCargados.map((item) => (
                <ListGroupItem key={item.id}>
                  {/* Nombre y cantidad actual */}
                  <div className="mb-2">
                    {nombreDe(item.id)} – Cantidad: <strong>{item.cantidad}</strong>
                  </div>

                  <ButtonGroup size="sm">
                    {/* disminuir una unidad */}
                    <Button color="secondary" onClick={() => disminuirCantidad(item.id, item.cantidad)}>
                      -
                    </Button>
                    {/* aumentar una unidad */}
                    <Button color="success" onClick={() => aumentarCantidad(item.id, item.cantidad)}>
                      +
                    </Button>
                    {/* quitar el producto completo */}
                    <Button color="danger" outline onClick={() => desembarcarProducto(item.id)}>
                      Desembarcar
                    </Button>
                  </ButtonGroup>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default Inventario;
