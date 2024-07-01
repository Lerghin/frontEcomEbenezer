import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { IoIosAdd } from "react-icons/io";
import { API } from "../../Utils/axios";
import { Button } from 'react-bootstrap';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { useNavigate } from "react-router-dom";
import TablaProveedores from "../../components/Tables/TableProveedores";
import './Proveedores.css';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await API.get("/proveedores");
        const fetchedProv = response.data.response;
        console.log(fetchedProv);
        setProveedores(fetchedProv);
        setResults(fetchedProv);
      } catch (error) {
        console.error("Error fetching proveedores:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  if (loading) {
    return <p className="loading-message">Cargando...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (!proveedores || !results) {
    return <p className="no-results-message">No se encontró información de los proveedores.</p>;
  }

  const searcher = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    const filteredProveedores = proveedores.filter(
      (prov) =>
        prov.name.toLowerCase().includes(searchTerm) ||
        prov.lastName.toLowerCase().includes(searchTerm) ||
        prov.company.toLowerCase().includes(searchTerm) ||
        prov.productos.toLowerCase().includes(searchTerm)
    );
    setResults(searchTerm.trim() === "" ? proveedores : filteredProveedores);
  };

  const handleDelete = (id) => {
    setResults((prevResults) => prevResults.filter((prov) => prov._id !== id));
    setProveedores((prevProveedores) => prevProveedores.filter((prov) => prov._id !== id));
  };

  return (
    <div className="home">
      <div className="search-container">
        <input
          value={search}
          onChange={searcher}
          type="text"
          placeholder="Buscar Proveedores"
          className="form-control"
        />
        <Button onClick={() => navigate('/crearProveedor')} className="add-button">
          Agregar Proveedor <IoIosAdd />
        </Button>
      </div>

      <div className="patientsTable">
        {results.length > 0 ? (
          <Table striped bordered hover className="table">
            <thead>
              <tr>
                <th>Nombre y Apellido</th>
                <th>Teléfono</th>
                <th>Empresa</th>
                <th>Dirección</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((prov) => (
                <TablaProveedores key={prov._id} data={prov} onDelete={handleDelete} />
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="no-results-message">
            No se encontraron Proveedores.
            <div className="button-container">
              <Button onClick={() => navigate('/homeAdmin')} variant="secondary">
                <RiArrowGoBackFill /> Atras
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proveedores;
