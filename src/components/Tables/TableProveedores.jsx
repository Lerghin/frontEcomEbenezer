import {  useNavigate } from "react-router-dom";

import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";


import { API } from "../../Utils/axios";




const TablaProveedores = ({ data, onDelete }) => {
  const {
 _id,
    name, 
   lastName,
    phone,
   productos,
   company,
   address,
  
 
  } = data;
  

 

  
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar la Vacante?")) {
      try {
        await API.delete(`/proveedores/${id}`);
        onDelete(id); 
        navigate('/proveedores')
       
      } catch (error) {
        alert(error)
       
      }
    }
  };

  

  return (    
    <tr>
        <td>{name} {lastName}</td>
      <td>
        {phone}
      </td>
    
      <td>{  company}</td>
      <td>{address}</td>
      <td>{ productos}</td>
     
    
    <td  >
      <FaUserEdit className="m-2 my-2 h-5" onClick={() => navigate(`/editProveedor/${_id}`)}  /> 
      
        <MdDeleteForever className="m-2 "  onClick={()=>handleDelete(_id) }/>
       
      </td>
    </tr>
  );
};

export default TablaProveedores;