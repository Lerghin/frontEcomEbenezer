import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Button } from 'react-bootstrap';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { useNavigate } from "react-router-dom";
import { LS } from "../../utils/LS";
import TableVent from "../../components/Tables/TableVent";

import './ventas.css'; 
import { API } from "../../Utils/axios";


 // Importa los estilos CSS

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await API.get("/ventas");
        const fetchedVent = response.data.response;
        setVentas(fetchedVent);
        setResults(fetchedVent);
      
      } catch (error) {
        console.error("Error fetching Ventas:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!ventas || !results) {
    return <p>No se encontró información de las ventas</p>;
  }

  const searcher = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    const filteredVentas = ventas.filter(
      (vent) =>
        vent.nombre.toLowerCase().includes(searchTerm) ||
        vent.apellido.toLowerCase().includes(searchTerm) ||
        vent.referenciaPago.toLowerCase().includes(searchTerm) ||
        vent.userId.email.toLowerCase().includes(searchTerm) ||
        vent.cedula.toString().includes(searchTerm)
    );
    setResults(searchTerm.trim() === "" ? ventas : filteredVentas);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (date) {
      const formattedDate = date.toISOString().split("T")[0];

      const filteredVentas = ventas.filter((pat) => {
        return pat.fechaPago.includes(formattedDate);
      });

      setResults(filteredVentas);
    } else {
      setResults(ventas);
    }
  };

  return (
    <div className="container">
      <div className="d-flex gap-4 w-100 my-4">
        <input
          style={{ textAlign: "center" }}
          value={search}
          onChange={searcher}
          type="text"
          placeholder="Buscar Venta"
          className="form-control"
        />
         
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="form-control text-center"
          placeholderText="Buscar por Fecha"
        />
      </div>
      <Button variant="secondary" onClick={() => navigate('/homeAdmin')}>Volver</Button>
    

      <div className="table-container">
        {results.length > 0 ? (
          <Table striped bordered hover className="table-custom">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Nombre y Apellido</th>
                <th>Cédula</th>
                <th>Productos</th>
                <th>Monto Depositado por el Cliente  <span className="small">Nota: Si es pago movil es en Bs</span></th>
                <th>Referencia de Pago</th>
                <th>Método de Pago</th>
               
         
              </tr>
            </thead>
            <tbody>
              {results.map((venta) => (
                <TableVent
                  key={venta._id}
                  data={venta}
                  
                />
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="d-flex justify-content-center gap-5 p-4 h-100vh">
            <p>No se encontraron Ventas</p>
           
          </div>
        )}
      </div>
    </div>
  );
};

export default Ventas;
