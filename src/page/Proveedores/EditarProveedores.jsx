import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { BiSolidSave } from 'react-icons/bi';
import { API } from '../../utils/axios';
import './editProveedor.css'; // Puedes crear este archivo CSS para estilos personalizados

const EditProveedor = () => {
  const { id } = useParams(); // Obtenemos el ID del proveedor desde la URL
  const navigate = useNavigate();

  // Estado para los datos del formulario
  const [proveedorData, setProveedorData] = useState({
    name: '',
    lastName: '',
    company: '',
    address: '',
    phone: '',
    productos: '',
  });

  // Cargar los datos del proveedor existente
  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const { data } = await API.get(`/proveedores/${id}`);
        setProveedorData(data.response);
      } catch (error) {
        const message = error.response ? error.response.data.message : error.message;
        console.error(error);
        toast.error(message);
      }
    };
    fetchProveedor();
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProveedorData({ ...proveedorData, [name]: value });
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Actualizar el proveedor en el backend
      await API.put(`/proveedores/${id}`, proveedorData);
      toast.success('Proveedor actualizado con éxito');
      navigate('/proveedores');
    } catch (error) {
      const message = error.response ? error.response.data.message : error.message;
      console.error(error);
      toast.error(message);
    }
  };

  return (
    <Container className="edit-proveedor-container">
      <h2 className="text-center my-4">Editar Proveedor</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formProviderName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={proveedorData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formProviderLastName">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={proveedorData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formProviderCompany">
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              type="text"
              name="company"
              value={proveedorData.company}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formProviderAddress">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={proveedorData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
         
          <Form.Group as={Col} controlId="formProviderPhone">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={proveedorData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formProviderProductos">
            <Form.Label>Referencia de Productos</Form.Label>
            <Form.Control
              type="text"
              name="productos"
              value={proveedorData.productos}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        <div className="d-flex justify-content-center gap-4 mt-4">
          <Button variant="success" type="submit">
            <BiSolidSave /> Guardar
          </Button>
          <Button onClick={() => navigate('/verProveedores')} variant="secondary">
            <RiArrowGoBackFill /> Volver
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditProveedor;
