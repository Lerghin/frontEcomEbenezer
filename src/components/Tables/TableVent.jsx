
import { Link } from 'react-router-dom';
import './../../page/Ventas/ventas.css';  // Importa los estilos CSS

const TableVent = ({ data }) => {
  const {

    nombre,
    fechaPago,
    apellido,
    referenciaPago,
    cedula,
    metodoPago,
    productos,
    userId,
    montoDepositado
  } = data;

  





  const formatDate = (dateString) => {
    // Convierte el string de fecha a un objeto Date
    const date = new Date(dateString);
    // Utiliza Intl.DateTimeFormat para formatear la fecha
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <tr>
          <td>{formatDate(fechaPago)}</td>
          <td className="namePatient  ">  <Link   to={`/watchUser/${userId._id}`} className="link-unstyled" >{userId.email}</Link></td>
      <td>{nombre} {apellido}</td>
      <td>{cedula}</td>
      <td>
        {productos.map((pro) => (
          <div key={pro._id}>
            <b>Nombre:</b> {pro.nombre} <br />
            <b>Cantidad:</b> {pro.cantidad} Unidad(es)
          </div>
        ))}
      </td>
      <td>{montoDepositado}</td>
      <td>{referenciaPago}</td>
      <td>{metodoPago}</td>
     
   
    </tr>
  );
};

export default TableVent;
