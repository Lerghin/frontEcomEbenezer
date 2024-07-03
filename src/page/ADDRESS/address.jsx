import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { IoCreate } from "react-icons/io5";
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { API } from '../../utils/axios.js';
import '../Users/userSales.css';
import { LS } from '../../utils/LS.js';
import { useSelector } from 'react-redux';


const Address = () => {
  const { user } = useSelector((store) => store.authReducer);
  const navigate = useNavigate();
  const { id } = useParams();

  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const userId = LS.getText("userID");
    if (userId) {
      setUserID(userId);
    } else {
      setUserID("no tenemos UserID");
    }
  }, [user]);

  useEffect(() => {
    if (!userID) return; 

    const fetchData = async () => {
      setLoading(true);
      try {
        const salesResponse = await API.get(`/address/usuario/${userID}`);
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

  const handleDelete = async (addressId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta dirección?");
    if (confirmDelete) {
      try {
        await API.delete(`/address/${addressId}`);
        // Actualizar la lista de direcciones después de la eliminación
        setSalesList(salesList.filter(address => address._id !== addressId));
        alert("Dirección eliminada exitosamente");
      } catch (err) {
        console.error("Error al eliminar la dirección:", err.message);
        setError("Error al eliminar la dirección.");
      }
    }
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
      {salesList.length > 0 ? (
        <div className="card sales-card mb-4">
          <div className="card-body">
            <h5 className="card-title text-center">Direcciones Registradas</h5>
            <div className="table-responsive">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Dirección</th>
                    <th>País</th>
                    <th>Estado</th>  
                    <th>Municipio</th>
                    <th>Parroquia</th>
                    <th>Acciones</th> {/* Nueva columna para acciones */}
                  </tr>
                </thead>
                <tbody>
                  {salesList.map((sale) => (
                    <tr key={sale._id}>
                      <td>{sale.direccion}</td>
                      <td>{sale.pais}</td>
                      <td>{sale.estado}</td>
                      <td>{sale.municipio}</td>
                      <td>{sale.parroquia}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/editAddress/${sale._id}`)}
                        >
                          <AiFillEdit /> Editar
                        </Button>{' '}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(sale._id)}
                        >
                          <AiFillDelete /> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-center">No hay direcciones disponibles para este usuario.</p>
      )}

      <div id="buttons-container" className="d-flex justify-content-center gap-3">
        <Button onClick={() => navigate('/homeAdmin')} variant="secondary">
          <RiArrowGoBackFill /> Volver
        </Button>
        <Button onClick={() => navigate('/createAddress')} variant="primary">
          <IoCreate /> Crear Nueva Dirección
        </Button>
      </div>
    </div>
  );
};

export default Address;
