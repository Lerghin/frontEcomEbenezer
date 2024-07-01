import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
  } from "cdbreact";
  import { NavLink } from "react-router-dom";
  import { useEffect, useState } from "react";

  import { useDispatch } from "react-redux";

  import './ResponsiveSideBar.css';
import { LS } from "../../Utils/LS";
import { logoutUser } from "../../Store/Actions/authActions";
  
  const SideBarUsers= () => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
  
    useEffect(() => {
      const role = LS.getText("role");
      if (role) {
        setUserRole(role.trim()); // Eliminar espacios extra si los hay
      }
      setLoading(false); // Marcar la carga como completada
    }, []);
  
    const handleLogout = () => {
      dispatch(logoutUser());
    };
  
    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }
  
    return (
      <div className="sidebar-custom">
        <CDBSidebar textColor="#fff" backgroundColor="#2584A7 ">
          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <a href="#" className="text-decoration-none" style={{ color: "inherit" }}>
              Menu
            </a>
          </CDBSidebarHeader>
  
          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              <NavLink to="/homeUser" className={({ isActive }) => (isActive ? "activeClicked" : "")}>
                <CDBSidebarMenuItem icon="home" className="menu-item">Inicio</CDBSidebarMenuItem>
              </NavLink>
            
             
  
              <NavLink to="/createUser" className={({ isActive }) => (isActive ? "activeClicked" : "")}>
                {userRole === "USER" ? null : (
                  <CDBSidebarMenuItem icon="user" className="menu-item">Crear Acceso Usuario</CDBSidebarMenuItem>
                )}
              </NavLink>
              <NavLink to="/createAdmin" className={({ isActive }) => (isActive ? "activeClicked" : "")}>
                {userRole === "USER" ? null : (
                  <CDBSidebarMenuItem icon="user" className="menu-item">Crear Acceso Administrador</CDBSidebarMenuItem>
                )}
              </NavLink>
            </CDBSidebarMenu>
          </CDBSidebarContent>
  
          <CDBSidebarFooter style={{ textAlign: "center" }}>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
            <div style={{ padding: "20px 5px" }}>©Saltysnack Tuyero C.A.</div>
          </CDBSidebarFooter>
        </CDBSidebar>
      </div>
    );
  };
  
  export default SideBarUsers;
  