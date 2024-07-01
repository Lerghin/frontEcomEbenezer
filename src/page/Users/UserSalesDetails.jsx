import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FiPrinter } from 'react-icons/fi';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { generatePDFUserAndSales } from './generatePDFUserAndSales';
import { API } from '../../Utils/axios';
import './userSales.css';

const UserSalesDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, salesResponse] = await Promise.all([
          API.get(`/auth/users/${id}`),
          API.get(`/ventas/usuario/${id}`)
        ]);
        setUser(userResponse.data.response);
        setSalesList(salesResponse.data.response || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    generatePDFUserAndSales(user, salesList);
  };

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">Error: {error}</p>;
  }

  if (!user) {
    return <p className="text-center">No se encontró información del usuario.</p>;
  }

  return (
    <div className="container1 p-4 user-sales-container">
      <div className="card user-card mb-4">
        <div className="card-body">
          <h5 className="card-title">Detalles del Usuario:</h5>
          <p className="card-text"><b>Nombre Completo:</b> {user.name} {user.lastName}</p>
          <p className="card-text"><b>Cédula:</b> {user.dni}</p>
          <p className="card-text"><b>Teléfono:</b> {user.phone}</p>
          <p className="card-text"><b>Email:</b> {user.email}</p>
          <p className="card-text"><b>Dirección:</b> {user.address}</p>
        </div>
      </div>

      {salesList.length > 0 ? (
        <div className="card sales-card mb-4">
          <div className="card-body">
            <h5 className="card-title text-center">Ventas Realizadas</h5>
            <div className="table-responsive">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Fecha de Pago</th>
                    <th>Método de Pago</th>
                    <th>Monto Depositado <span className="small">Nota: Si es pago movil es en Bs</span> </th>  
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
        <Button onClick={() => navigate('/ventas')} variant="secondary"><RiArrowGoBackFill /> Volver</Button>
      </div>
    </div>
  );
};

export default UserSalesDetails;
