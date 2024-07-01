import { useNavigate } from 'react-router-dom';
import '../Signup/signup.css';
import { countries } from '../../data/countries';

import { toast } from 'react-toastify';
import { useState } from 'react';

import { API } from '../../utils/axios';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../credenciales';


const CrearAdmin = () => {

  const navigate = useNavigate();
  const [role, setRole]= useState("ADMIN")
  const [data, setData] = useState({
    name: '',
    lastName: '',
    email: '',
    dni: '',
    password: '',
    country: '',
    photo: 'https://i.postimg.cc/G2Jy4YNm/smile.png',
    phone: '',
    role: role,
    terms: false
  });

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false); // Estado para rastrear si la foto se está subiendo
  const [photoUploaded, setPhotoUploaded] = useState(false); // Estado para rastrear la subida de la foto

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    if (selectedPhoto) {
      setIsUploadingPhoto(true); // Inicia el estado de subida

      const reader = new FileReader();
      reader.onload = () => {
        const previewImage = document.getElementById('preview-image');
        previewImage.src = reader.result;
      };
      reader.readAsDataURL(selectedPhoto);

      // Sube la foto a Firebase Storage
      const storageRef = ref(storage, `photos/${selectedPhoto.name}`);
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
          setIsUploadingPhoto(false); // Restablece el estado de subida en caso de error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prevState) => ({ ...prevState, photo: downloadURL }));
            toast.success("Foto subida exitosamente");
            setIsUploadingPhoto(false); // Finaliza el estado de subida
            setPhotoUploaded(true); // Marca que la foto ha sido subida
          });
        }
      );
    }
  };

  const handleChangeData = (e) => {
    setData((prevState) => {
      return e.target.name === 'terms'
        ? { ...prevState, [e.target.name]: e.target.checked }
        : { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    if (isUploadingPhoto) {
      toast.error("Espere a que la foto termine de subir.");
      return;
    }
    if (!photoUploaded) {
      toast.error("Por favor, suba una foto antes de registrar.");
      return;
    }
    try {
      const userData = { ...data };
      if (userData.terms) {
        delete userData.terms;
        console.log("Data to be sent to API:", userData); // Depuración

        const res = await API.post('/auth/up', userData);

        console.log("API Response:", res.data); // Depuración
        if (res && res.data && res.status === 201) {
        
          navigate('/users');

          alert("Has registrado exitosamente el usuario");
        }
      }
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message);
      console.log(error);
    }
  };

  return (
    <div className="signup-container1">
      <h2>Registro:</h2>
      <form className="signup-form" onSubmit={handleSubmitData}>
        <div className="form-group">
          <label htmlFor="firstName">Nombre:</label>
          <input
            className='container-fluid input-sign'
            type="text"
            id="firstName"
            name="name"
            value={data.name}
            onChange={handleChangeData}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Apellido:</label>
          <input
            className='container-fluid input-sign'
            type="text"
            id="lastName"
            name="lastName"
            value={data.lastName}
            onChange={handleChangeData}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dni">Cedula:</label>
          <input
            type="number"
            id="dni"
            name="dni"
            className='container-fluid input-sign'
            value={data.dni}
            onChange={handleChangeData}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            className='container-fluid input-sign'
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChangeData}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            className='container-fluid input-sign'
            id="password"
            name="password"
            value={data.password}
            onChange={handleChangeData}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">País de Residencia:</label>
          <select className='container-fluid input-sign'
            id="country"
            name="country"
            value={data.country}
            onChange={handleChangeData}
            required
          >
            <option value="">Selecione País</option>
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="photo">Foto:</label>
          <input
            type="file"
            id="photo"
            className='container-fluid input-sign'
            accept="image/*"
            onChange={handlePhotoChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="preview-image">Preview Foto:</label>
          <img id="preview-image" src={data.photo} alt="Preview" className='img-s' />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono:</label>
          <input
            className='container-fluid input-sign'
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={handleChangeData}
            required
          />
        </div>
        <div className="display">
          <label htmlFor="role">Rol:</label>
          <input
            className='container-fluid input-sign'
            type="text"
            id="role"
            name="role"
            value={data.role}
            onChange={handleChangeData}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="terms">Acepto los Términos y Condiciones</label>
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={data.terms}
            onChange={handleChangeData}
            required
          />
        </div>
      
        <button type="submit" className="signup-button" disabled={isUploadingPhoto}>
          Registrar
        </button>
      </form>
    
    </div>
  );
};

export default CrearAdmin;
