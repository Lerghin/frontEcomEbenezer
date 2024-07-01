import { useState, useEffect } from "react";
import "./Comprar.css";
import Formulario from "../../components/Formulario/Formulario.jsx";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Comprar() {
  const [cartData, setCartData] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [montoBs, setMontoBs] = useState(0);
  const [errorMensaje, setErrorMensaje] = useState(""); // Estado para el mensaje de error

  const location = useLocation();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://v6.exchangerate-api.com/v6/8ee293f7c8b83cfe4baa699c/latest/USD");
        const valorDollar = res.data.conversion_rates.VES;
        setMontoBs(valorDollar);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state && location.state.userId) {
      setUserId(location.state.userId);
      console.log(location.state) // Obtener el userId del estado de la ubicación
    }
  }, [location.state]);

  useEffect(() => {
    const storedCartData = JSON.parse(sessionStorage.getItem("cartData"));
    if (storedCartData && storedCartData.length > 0) {
      setCartData(storedCartData);
    } else {
      setErrorMensaje("Debe ir al inicio y seleccionar lo que desea agregar al carrito.");
    }
  }, []);

  const Pagar = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMostrarFormulario(true);
  };

  // Calcular el total de compras, asegurando que cartData es siempre un array
  const total = cartData.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <>
      <section className="checkout">
        {errorMensaje ? (
          <div className="error-mensaje ">
            <p>{errorMensaje}</p>
        
            <Link type="button" className=" btn btn-primary " to="/home">
              Ir al inicio
            </Link>
      
          </div>
        ) : (
          cartData && cartData.length > 0 && (
            <div>
              <div className="title"><h2>Resumen de Compras</h2></div>
              <div className="products">
                <ul>
                  {cartData.map((product) => (
                    <main key={product._id}>
                      <div>
                        <li>
                          <img src={product.thumbnail} alt={product.title} />
                          <div>
                            <strong>{product.title}</strong>
                          </div>
                          <div>
                            <strong>Cantidad: {product.quantity}</strong>
                          </div>
                          <div>
                            USD$ {product.price}
                          </div>
                        </li>
                      </div>
                    </main>
                  ))}
                </ul>
              </div>
              <h3>
                <b>Total en USD:</b>  {total} $ <br />
                <b>Tasa BCV del día: </b>  {montoBs} Bs<br />
                <b>Total en BS: </b> {(parseFloat(montoBs) * total).toFixed(2) } Bs <br />
              </h3>
            </div>
          )
        )}
        {!errorMensaje && (
          <div className="button">
            <a
              type="button"
              className="btn btn-primary"
              href="#formulario"
              onClick={Pagar}
            >
              Pagar
            </a>

            <Link type="button" className="btn btn-danger" to="/home">
              Atras
            </Link>
          </div>
        )}
      </section>
      <br /> <br />
      <section id="formulario" className={`formulario${mostrarFormulario ? "" : " oculto"}`}>
        {mostrarFormulario && (
          <>
            <h2>Formulario de Pago</h2>
            <Formulario userId={userId} cartData={cartData} total={total} montoBs={montoBs} /> {/* Pasamos el total al componente Formulario */}
          </>
        )}
      </section>
    </>
  );
}

export default Comprar;
