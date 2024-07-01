import { useEffect, useState } from "react";
import "../Navbar/navbarmain.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CiUser } from "react-icons/ci";
import { LS } from "../../Utils/LS";
import { logoutUser } from "../../Store/Actions/authActions";

const Navbar = () => {
  const { user } = useSelector((store) => store.authReducer);
  const dispatch = useDispatch();
  const [logged, setLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    const token = LS.getText("token");
    if (token) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, [user]);

  useEffect(() => {
    try {
      const role = LS.getText("role")?.trim();  // Handle potential null or undefined role
      if (role) {
        setUserRole(role);
      } else {
        setUserRole("GUEST");  // Set a default role if no role is found
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      setUserRole("GUEST");  // Default role in case of error
    }
  }, [user]);


  return (
    <header>
      <div className="head">
        <nav className="navbar navbar-expand-sm ">
          <div className=" container-fluid ">
            <Link id="main" className="mytinery " to="/home">
              <img
                src="/imagenes/ebenezer.jpg"
                alt="Logo"
                id="logo"
                className="img-fluid w-100"
              />
              Repuestos Ebenezer C.A.
            </Link>
          </div>
          <div className="navbar-nav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link id="main" className="nav-link" to="/home">
                  Inicio
                </Link>
              </li>
            
              {logged ? (

                <>
                   {userRole !== 'USER' && (
                    <li className="nav-item active">
                      <Link to="/homeAdmin" className="nav-link" >
                       Dashboard
                      </Link>
                    </li>
                  )}



                  {userRole !== 'ADMIN' && (
                    <li className="nav-item active">
                      <Link to="/comprar" className="nav-link" >
                      Pagar
                      </Link>
                    </li>
                  )}
                   {userRole !== 'ADMIN' && (
                    <li className="nav-item active">
                      <Link to="/homeAdmin" className="nav-link" >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  {userRole !== 'USER' && (
                    <li className="nav-item active">
                      <Link to="/verProductos" className="nav-link" >
                        Productos
                      </Link>
                    </li>
                  )}
                  <li className="navbar-item">
                    <button onClick={handleLogout} className="navbar-button">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="navbar-item">
                  <Link to="/signin" className="navbar-link">
                    <CiUser /> Login
                  </Link>
                </li>
              )}
        
            {user?.photo && (
                <li className="navbar-item m-2 ">
                  <img src={user.photo} alt="User" className="profile-image" />
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
