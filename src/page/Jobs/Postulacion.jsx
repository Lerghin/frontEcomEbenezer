import { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './Formulario.css'; // Archivo CSS para estilos adicionales
import { API } from '../../utils/axios';
import { useNavigate } from 'react-router';
import { LS } from '../../utils/LS';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../credenciales';
import { toast } from 'react-toastify';

const Formulario = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [profesion, setProfesion] = useState('');
  const [userId, setUserId] = useState('');
  const [cv, setCv] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userID = LS.getText('userID').trim();
    if (userID) {
      setUserId(userID);
    }
  }, []);

  const handleCvChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1048576) { // 1MB en bytes
        toast.error("El archivo excede el tamaño máximo de 1MB.");
        return;
      }

      setIsUploading(true);

      const storageRef = ref(storage, `cvs/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading the file:", error);
          toast.error("Error subiendo el archivo, intente nuevamente.");
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setCv(downloadURL);
            toast.success("CV subido exitosamente.");
            setIsUploading(false);
            setCvUploaded(true);
          });
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombre,
      apellido,
      cedula,
      profesion,
      cv,
      userId
    };

    console.log(data);

    try {
      // Suponiendo que tu API usa headers para autenticación, inclúyelos aquí
      const response = await API.post('/postulaciones', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        toast.success('Postulación enviada con éxito');
        navigate('/homeAdmin');
      } else {
        console.error('Error al enviar la postulación');
        toast.error('Error al enviar la postulación');
      }
    } catch (error) {
      console.error('Error al enviar la postulación:', error);
      toast.error('Error al enviar la postulación');
    }
  };

  return (
    <Container className="postulacion-form-container">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h3 className="text-center mb-4">Postulación</h3>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
            <Form.Group controlId="nombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Introduce tu nombre"
                required
              />
            </Form.Group>
            <Form.Group controlId="apellido" className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Introduce tu apellido"
                required
              />
            </Form.Group>
            <Form.Group controlId="cedula" className="mb-3">
              <Form.Label>Cédula</Form.Label>
              <Form.Control
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Introduce tu cédula"
                required
              />
            </Form.Group>
            <Form.Group controlId="profesion" className="mb-3">
              <Form.Label>Profesión</Form.Label>
              <Form.Control
                type="text"
                value={profesion}
                onChange={(e) => setProfesion(e.target.value)}
                placeholder="Introduce tu profesión"
                required
              />
            </Form.Group>
            <Form.Group controlId="cv" className="mb-3">
              <Form.Label>Subir CV (PDF, máx. 1MB)</Form.Label>
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={handleCvChange}
              />
              {cvUploaded && (
                <div className="mt-2">
                  <a href={cv} target="_blank" rel="noopener noreferrer">Ver CV Subido</a>
                </div>
              )}
            </Form.Group>
            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                disabled={isUploading || !cvUploaded}
              >
                {isUploading ? 'Subiendo CV...' : 'Enviar Postulación'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Formulario;
