import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { BiSolidSave } from 'react-icons/bi';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import './createProduct.css';
import { API } from '../../utils/axios';
import { storage } from '../../credenciales';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    thumbnail: '',
    category: '',
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [originalThumbnail, setOriginalThumbnail] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProductData(data.response);
        setOriginalThumbnail(data.thumbnail);
      } catch (error) {
        toast.error('Error al cargar los datos del producto');
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    if (type === 'file' && files.length > 0) {
      setImageFile(files[0]);
    } else if (type === 'checkbox') {
      setProductData({ ...productData, [name]: checked });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let downloadURL = productData.thumbnail;

      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);

            switch (snapshot.state) {
              case 'paused':
                console.log('Subida en pausa');
                break;
              case 'running':
                console.log('Subida en progreso');
                break;
              default:
                break;
            }
          },
          (error) => {
            toast.error('Error al subir la imagen.');
            console.error(error);
          },
          async () => {
            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (originalThumbnail) {
              const imageRef = ref(storage, originalThumbnail);
              await deleteObject(imageRef);
            }

            const updatedProductData = { ...productData, thumbnail: downloadURL };
            await API.put(`/products/${id}`, updatedProductData);
            toast.success('Producto actualizado con éxito');
            navigate('/verProductos');
          }
        );
      } else {
        const updatedProductData = { ...productData, thumbnail: downloadURL };
        await API.put(`/products/${id}`, updatedProductData);
        toast.success('Producto actualizado con éxito');
        navigate('/verProductos');
      }
    } catch (error) {
      const message = error.response ? error.response.data.message : error.message;
      toast.error(message);
    }
  };

  return (
    <Container className='container1'>
      <h2 className="text-center my-4">Editar Producto</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formProductName">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formProductDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formProductPrice">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formProductStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formProductThumbnail">
            <Form.Label>Agregar Imagen del Producto</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              name="thumbnail"
              onChange={handleChange}
            />
            {originalThumbnail && (
              <div className="mt-3">
                <img src={originalThumbnail} alt={productData.name} className="current-thumbnail" />
                <p>Imagen actual</p>
              </div>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="formProductCategory">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Categoría</option>
              <option value="kit">Kit</option>
              <option value="bombas">Bombas</option>
              <option value="bases">Bases</option>
              <option value="embrague">Embragues</option>
              <option value="tapas">Tapas</option>
              <option value="cigueñal">Cigueñal</option>
              <option value="bujes">Bujes</option>
              <option value="mozo">Mozos</option>
              <option value="sensors">Sensores</option>
              <option value="valvulas">Válvulas</option>
              <option value="purificadores">Purificadores</option>
              <option value="tomas">Tomas de Agua</option>
              <option value="alternador">Alternadores</option>
            </Form.Control>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formProductIsActive" className='d-flex justify-center gap-4'>
            <Form.Label>Estado: </Form.Label>
            <Form.Check
              type="checkbox"
              name="isActive"
              label="Activo"
              checked={productData.isActive}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        
        {uploadProgress > 0 && (
          <Row className="mb-3">
            <Col>
              <ProgressBar now={uploadProgress} label={`${Math.round(uploadProgress)}%`} />
            </Col>
          </Row>
        )}

        <div className="d-flex justify-content-center gap-4 mt-4">
          <Button variant="success" type="submit">
            <BiSolidSave /> Guardar Cambios
          </Button>
          <Button onClick={() => navigate('/verProductos')} variant="secondary">
            <RiArrowGoBackFill /> Volver
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditProduct;
