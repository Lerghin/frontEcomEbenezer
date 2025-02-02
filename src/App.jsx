import "./App.css";
import Home from "./page/Home/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Loyaut from "./page/Loyaut/Loyaut";
import Componente404 from "./page/Componente404/Componente404";
import { Provider, useSelector } from "react-redux";

import SignUp from "./page/Signup/SignUp";
import Signin from "./page/Signin/Signin";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comprar from "./page/Comprar/Comprar";
import { CartProvider } from './components/context/cart.jsx';
import HomeAdmin from "./page/Home/HomeAdmin.jsx";
import Productos from "./page/Productos/Productos.jsx";
import CreateProduct from "./page/Productos/AddProduct.jsx";
import EditProduct from "./page/Productos/EditProduct.jsx";
import Ventas from "./page/Ventas/Ventas.jsx";
import Users from "./page/Users/User.jsx";
import CrearAdmin from "./page/Signup/CrearAdmin.jsx";
import CreateProveedor from "./page/Proveedores/CrearProveedor.jsx";
import Proveedores from "./page/Proveedores/Proveedores.jsx";
import EditProveedor from "./page/Proveedores/EditarProveedores.jsx";
import UserSalesDetails from "./page/Users/UserSalesDetails.jsx";
import store from "./store/store.js";
import MisCompras from "./page/Users/MisCompras.jsx";
import Address from "./page/ADDRESS/address.jsx";
import CreateAddress from "./page/ADDRESS/crearDirecciones.jsx";
import EditAddress from "./page/ADDRESS/EditAddress.jsx";
import ViewPostulaciones from "./page/Jobs/VerPostulaciones.jsx";
import PostulacionFormulario from "./page/Jobs/Postulacion.jsx";
import Postulacion from "./page/Jobs/Postulacion.jsx";




const ProtectedRoute = ()=>{
  const {status}= useSelector(store=>store.authReducer)
  if(status==="online"){
    return<Outlet/>
  }
  return <Navigate to='/home'/>
    
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Loyaut />,
    children: [
     
      {
        path: '/',
        element: <ProtectedRoute/>,
        children:[
          
        
            {
              path: '/comprar',
              element: <Comprar />
            },
            {
              path: '/homeAdmin',
              element: <HomeAdmin />
            },
            {
              path: '/verProductos',
              element: <Productos />
            },
            {
              path: '/addProducto',
              element: <CreateProduct />
            },
            {
              path: '/editProduct/:id',
              element: <EditProduct />
            },
            {
              path: '/ventas',
              element: <Ventas />
            },
            {
              path: '/users',
              element: <Users/>
            },
          {
              path: '/crearAdmin',
              element: <CrearAdmin/>
            },
            {
              path: '/crearProveedor',
              element: <CreateProveedor/>
            },
            {
              path: '/proveedores',
              element: <Proveedores/>
      
            },
            {
              path: '/editProveedor/:id',
              element: <EditProveedor />
            },
            {
              path: '/watchUser/:id',
              element: <UserSalesDetails />
            },
            {
              path: '/misCompras',
              element: <MisCompras />
            },
            {
              path: '/misDirecciones',
              element: <Address />
            },
            {
              path: '/createAddress',
              element: <CreateAddress />
            },

            {
              path: '/editAddress/:id',
              element: <EditAddress />
            },
            {
              path: '/viewJobs',
              element: <ViewPostulaciones />
            },
            {
              path: '/jobs',
              element: <Postulacion />
            }


           
        ]
      },
      
      
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/signin',
        element: <Signin />
      },
      {
        path: '/signUp',
        element: <SignUp />
      },
      {
        path: '*',
        element: <Componente404 />
      }
    ]
  }
]);

function App() {


  return (
   
    <Provider store={store}>
       <CartProvider>
      <RouterProvider router={router} />
      </CartProvider>
      <ToastContainer />
    </Provider>
  );
}

export default App;
