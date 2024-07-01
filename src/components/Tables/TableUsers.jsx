import { Link } from "react-router-dom";
import classNames from 'classnames';
import './TablaUsers.css'; // Asegúrate de importar el archivo CSS

const TablaUsers = ({ data }) => {
  const { photo, phone, name, lastName, email, dni, role, _id } = data;

  return (
    <tr>
      <td>
        <img
          src={photo}
          alt="image-user"
          style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
      </td>
      {/* Aplicar la clase "namePatient" solo si el rol es "USER" */}
      <td className={classNames({ namePatient: role === "USER" })}>
        <Link to={`/watchUser/${_id}`} className="link-unstyled">
          {name} {lastName}
        </Link>
      </td>
      <td>{dni}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>{role}</td>
    </tr>
  );
};

export default TablaUsers;
