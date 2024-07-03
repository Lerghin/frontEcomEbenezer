import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FiPrinter } from 'react-icons/fi';
import { RiArrowGoBackFill } from 'react-icons/ri';

import { API } from '../../utils/axios.js';
import './userSales.css';
import { LS } from '../../utils/LS.js';
import { useSelector } from 'react-redux';
import { generatePDFONLYSALES } from './generatePDFONLYSALES.js';

const MisCompras = () => {
  const { user } = useSelector((store) => store.authReducer);
  const navigate = useNavigate();
  const { id } = useParams();

  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(null);

  // Obtener el userID desde LocalStorage cuando el componente se monta
  useEffect(() => {
    const userId = LS.getText("userID");
    console.log("userID obtenido del LocalStorage:", userId);
    if (userId) {
      setUserID(userId);
    } else {
      setUserID("no tenemos UserID");
    }
  }, [user]);

  // Realizar la petición a la API cuando userID cambia
  useEffect(() => {
    if (!userID) return;  // Si no hay userID, no hacer la llamada a la API

    const fetchData = async () => {
      setLoading(true);
      try {
        const salesResponse = await API.get(`/ventas/usuario/${userID}`);
        console.log("Respuesta de la API para ventas:", salesResponse.data.response);
        setSalesList(salesResponse.data.response || []);
      } catch (err) {
        console.error("Error al obtener las ventas:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userID]);

  const handlePrint = () => {
    generatePDFONLYSALES(user, salesList);
  };

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">Error: {error}</p>;
  }

  if (!salesList.length) {
    return <p className="text-center">No se encontró información del usuario.</p>;
  }

  return (
    <div className="container1 p-4 user-sales-container">
      <div className="card user-card mb-4">
        {/* Información del usuario (si necesitas mostrar algo aquí) */}
      </div>

      {salesList.length > 0 ? (
        <div className="card sales-card mb-4">
          <div className="card-body">
            <h5 className="card-title text-center">Compras Realizadas</h5>
            <div className="table-responsive">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Fecha de Pago</th>
                    <th>Método de Pago</th>
                    <th>Monto Depositado <span className="small">Nota: Si es pago movil es en Bs</span></th>  
                    <th>Referencia de Pago</th>
                    <th>Productos</th>
                  </tr>
                </thead>
                <tbody>
                  {salesList.map((sale) => (
                    <tr key={sale._id}>
                      <td>{new Date(sale.fechaPago).toLocaleDateString()}</td>
                      <td>{sale.metodoPago}</td>
                      <td>{sale.montoDepositado}</td>
                      <td>{sale.referenciaPago}</td>
                      <td>
                        {sale.productos.map((producto) => (
                          <div key={producto._id} className="producto">
                            <p><b>Nombre:</b> {producto.nombre}</p>
                            <p><b>Cantidad:</b> {producto.cantidad}</p>
                            <p><b>Precio:</b> {producto.precio}</p>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-center">No hay ventas disponibles para este usuario.</p>
      )}

      <div id="buttons-container" className="d-flex justify-content-center gap-3">
        <Button onClick={handlePrint} variant="success"><FiPrinter /> Imprimir</Button>
        <Button onClick={() => navigate('/homeAdmin')} variant="secondary"><RiArrowGoBackFill /> Volver</Button>
      </div>
    </div>
  );
};

export default MisCompras;
