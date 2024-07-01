import  { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { API } from '../../utils/axios'; // Asegúrate de ajustar esta importación según tu configuración
import './ViewPostulaciones.css'; // Estilos personalizados
import { RiArrowGoBackFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const ViewPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
 const navigate=useNavigate();
  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const { data } = await API.get('/postulaciones'); // Asegúrate de ajustar la URL según tu configuración de API
        setPostulaciones(data.response);
      } catch (error) {
        const message = error.response ? error.response.data.message : error.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostulaciones();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPostulaciones = postulaciones.filter(postulacion =>
    postulacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    postulacion.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    postulacion.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    postulacion.profesion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="view-postulaciones-container">
      <h2 className="text-center my-4">Listado de Postulaciones</h2>

      <Form className="mb-4">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre, apellido, cédula o profesión"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <InputGroup.Text>🔍</InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
      </Form>
      <div id="buttons-container" className="d-flex justify-content-center gap-3">
      
      <Button onClick={() => navigate('/homeAdmin')} variant="secondary"><RiArrowGoBackFill /> Volver</Button>
    </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" />
        </div>
      ) : (
        <Table responsive bordered hover className="postulaciones-table">
          <thead className="table-header">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cédula</th>
              <th>Profesión</th>
              <th>Currículum</th>
            </tr>
          </thead>
          <tbody>
            {filteredPostulaciones.map(postulacion => (
              <tr key={postulacion._id}>
                <td>{postulacion.nombre}</td>
                <td>{postulacion.apellido}</td>
                <td>{postulacion.cedula}</td>
                <td>{postulacion.profesion}</td>
                <td>
                  <Button
                    variant="primary"
                    href={postulacion.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver CV
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ViewPostulaciones;
