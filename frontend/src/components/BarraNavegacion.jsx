
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Button, NavbarText } from 'reactstrap';

function BarraNavegacion({ usuario, vistaActiva, onCambiarVista, onCerrarSesion }) {
  return (
    <Navbar color="dark" dark expand="xs" className="px-3">
      <NavbarBrand>Evaluación II</NavbarBrand>
      <Nav className="me-auto" navbar>
        <NavItem>
          <NavLink
            href="#"
            active={vistaActiva === 'reactor'}
            onClick={(e) => {
              e.preventDefault();
              onCambiarVista('reactor');
            }}
          >
            Reactor
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="#"
            active={vistaActiva === 'inventario'}
            onClick={(e) => {
              e.preventDefault();
              onCambiarVista('inventario');
            }}
          >
            Inventario
          </NavLink>
        </NavItem>
      </Nav>
      <NavbarText className="me-3 d-none d-sm-inline">{usuario}</NavbarText>
      <Button color="outline-light" size="sm" onClick={onCerrarSesion}>
        Cerrar sesión
      </Button>
    </Navbar>
  );
}

export default BarraNavegacion;
