import { useEffect, useState } from 'react';
import './Formulario.css'; 
import { API } from '../../utils/axios';
import { useNavigate } from 'react-router';
import { LS } from '../../utils/LS';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../credenciales';
import { toast } from 'react-toastify';

const Formulario = ({ cartData, total, montoBs }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [referenciaPago, setReferenciaPago] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [montoDepositado, setMontoDepositado] = useState('');
  const [totalAPagar, setTotalAPagar] = useState(total);
  const [comprobante, setComprobante] = useState('');
  const [montoEnBs, setMontoEnBs] = useState(total * montoBs);
  const [userId, setUserID] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const userID = LS.getText('userID').trim();
    if (userID) {
      setUserID(userID);
    }
  }, []);

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    if (selectedPhoto) {
      setIsUploadingPhoto(true);

      const reader = new FileReader();
      reader.onload = () => {
        const previewImage = document.getElementById('preview-image');
        previewImage.src = reader.result;
      };
      reader.readAsDataURL(selectedPhoto);

      const storageRef = ref(storage, `comprobantes/${selectedPhoto.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedPhoto);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading the file:", error);
          toast.error("Error subiendo la foto, intente nuevamente");
          setIsUploadingPhoto(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setComprobante(downloadURL);
            toast.success("Foto subida exitosamente");
            setIsUploadingPhoto(false);
            setPhotoUploaded(true);
          });
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productos = cartData.map(product => ({
      _id: product._id,
      nombre: product.name, 
      precio: product.price,
      cantidad: product.quantity,
    }));

    const data = {
      nombre,
      apellido,
      telefono,
      cedula,
      referenciaPago,
      fechaPago,
      metodoPago,
      montoDepositado,
      userId,
      total: totalAPagar,
      montoEnBs,
      comprobante,
      productos,
    };

    try {
      const response = await API.post('/ventas', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }, responseType: 'blob'
      });

      if (response.status === 200 && response.headers['content-type'] === 'application/pdf') {
        alert('Compra realizada con éxito');
        LS.rm('cart');
        sessionStorage.removeItem('cartData');
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
        navigate('/homeAdmin');
      } else {
        console.error('Error al realizar la compra');
        alert('Error al realizar la compra');
      }
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      alert('Error al realizar la compra',error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="campo">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="campo">
        <label htmlFor="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
      </div>
      <div className="campo">
        <label htmlFor="telefono">Teléfono:</label>
        <input
          type="number"
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
      </div>
      <div className="campo">
        <label htmlFor="cedula">Cédula:</label>
        <input
          type="number"
          id="cedula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          required
        />
      </div>
      <label>Desglose de Productos:</label>
      {cartData.map((product) => (
        <div key={product._id} className="campo">
          <p><strong>Nombre del Producto:</strong> {product.name}</p> {/* Cambiar a 'product.title' */}
          <p><strong>Precio USD$:</strong> {product.price}</p>
          <p><strong>Cantidad:</strong> {product.quantity}</p>
        </div>
      ))}
      <div className="campo">
        <label htmlFor="totalAPagar">Total A Pagar en USD:</label>
        <input
          type="number"
          id="total"
          className='text-center'
          value={totalAPagar.toFixed(2)}
          readOnly
        />
      </div>
      <div className="campo">
        <label htmlFor="montoEnBs">Total A Pagar en BS:</label>
        <input
          type="number"
          id="montoEnBs"
          className='text-center'
          value={montoEnBs.toFixed(2)}
          readOnly
        />
      </div>
      <div className="campo">
        <label htmlFor="montoDepositado">Monto Depositado</label>
        <input
          type="number"
          id="montoDepositado"
          value={montoDepositado}
          onChange={(e) => setMontoDepositado(e.target.value)}
          required
        />
      </div>
      <div className="campo">
        <label htmlFor="comprobante">Comprobante de Pago:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />
        <img id="preview-image" alt="Vista previa del comprobante" style={{ display: photoUploaded ? 'block' : 'none' }} />
      </div>
      <div className="campo">
        <label htmlFor="referenciaPago">Referencia de Pago:</label>
        <input
          type="text"
          id="referenciaPago"
          value={referenciaPago}
          onChange={(e) => setReferenciaPago(e.target.value)}
          required
        />
      </div>
      <div className="campo">
        <label htmlFor="fechaPago">Fecha de Pago:</label>
        <input
          type="date"
          id="fechaPago"
          value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)}
          required
        />
      </div>
      <div className="campo">
        <label htmlFor="metodoPago">Método de Pago:</label>
        <select
          id="metodoPago"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          required
        >
          <option value="">Seleccione un método de pago</option>
          <option value="zelle">Zelle</option>
          <option value="pagoMovil">Pago Móvil</option>
          <option value="binancePay">BinancePay</option>
        </select>
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
