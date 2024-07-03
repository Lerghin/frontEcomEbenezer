import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './createAddres.css';
import { API } from '../../utils/axios';
import { useSelector } from 'react-redux';

const EditAddress = () => {
  const { id } = useParams(); // Obtener el ID de la dirección desde los parámetros de la URL
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.authReducer);

  const [addressData, setAddressData] = useState({
    direccion: '',
    municipio: '',
    parroquia: '',
    estado: '',
    codigoPostal: '',
    pais: '',
    userId: '' // Aquí se actualizará el userId actual
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Obtener los datos de la dirección desde la API usando el ID
    const fetchAddressData = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/address/${id}`);
        setAddressData(response.data.response);
      } catch (err) {
        setError('Error al cargar los datos de la dirección.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddressData();
  }, [id]);

  const handleChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Suponiendo que tu API para actualizar una dirección es `/api/direcciones/:id`
      const response = await API.put(`/address/${id}`, addressData);
      setSuccess('¡Dirección actualizada exitosamente!');
      navigate('/misDirecciones')
    } catch (err) {
      setError('Hubo un error al actualizar la dirección.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="edit-form-container">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="text-center mb-4">Editar Dirección</h2>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light custom-form">
            <Form.Group controlId="direccion" className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={addressData.direccion}
                onChange={handleChange}
                placeholder="Introduce la dirección"
                required
              />
            </Form.Group>

            <Form.Group controlId="pais" className="mb-3">
              <Form.Label>País</Form.Label>
              <Form.Control
                type="text"
                name="pais"
                value={addressData.pais}
                onChange={handleChange}
                placeholder="Introduce el país"
                required
              />
            </Form.Group>

            <Form.Group controlId="estado" className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                name="estado"
                value={addressData.estado}
                onChange={handleChange}
                placeholder="Introduce el estado"
                required
              />
            </Form.Group>

            <Form.Group controlId="municipio" className="mb-3">
              <Form.Label>Municipio</Form.Label>
              <Form.Control
                type="text"
                name="municipio"
                value={addressData.municipio}
                onChange={handleChange}
                placeholder="Introduce el municipio"
                required
              />
            </Form.Group>

            <Form.Group controlId="parroquia" className="mb-3">
              <Form.Label>Parroquia</Form.Label>
              <Form.Control
                type="text"
                name="parroquia"
                value={addressData.parroquia}
                onChange={handleChange}
                placeholder="Introduce la parroquia"
                required
              />
            </Form.Group>

            <Form.Group controlId="codigoPostal" className="mb-3">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control
                type="text"
                name="codigoPostal"
                value={addressData.codigoPostal}
                onChange={handleChange}
                placeholder="Introduce el código postal"
                required
              />
            </Form.Group>

            {error && <p className="text-danger text-center">{error}</p>}
            {success && <p className="text-success text-center">{success}</p>}
            <div className='d-flex justify-content-center m-2'>
              <Button variant="primary" type="submit" disabled={loading} className="text-center mt-4">
                {loading ? 'Actualizando...' : 'Actualizar Dirección'}
              </Button>
            </div>
            <div className='d-flex justify-content-center'>
              <Button onClick={() => navigate('/misDirecciones')} variant="secondary">Volver</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditAddress;
