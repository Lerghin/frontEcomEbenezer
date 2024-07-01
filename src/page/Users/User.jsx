import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import TablaUsers from "../../components/Tables/TableUsers.jsx";
import "./Users.css"; 
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { API } from "../../Utils/axios.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const navigate=useNavigate()

  useEffect(() => {
    API
      .get("/auth/users/traer")
      .then((response) => {
        const fetchUsers = response.data.response;
        setUsers(fetchUsers);
        setResults(fetchUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const searcher = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.dni.toString().includes(searchTerm)
    );

    setResults(searchTerm.trim() === "" ? users : filteredUsers);
  };

  return (
    <div className="home">

      <div className="search-container">
        <input
          value={search}
          onChange={searcher}
          type="text"
          placeholder='Buscar Usuario'
          className='form-control search-input'
        />
        <br /><br />
            <Button onClick={() => navigate('/crearAdmin')} variant="btn btn-primary"> Agregar Administrador <IoIosAdd /> </Button>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre y Apellido</th>
              <th>Cedula</th>
              <th>Usuario</th>
              <th>Teléfono</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {results.map((user) => (
              <TablaUsers key={user._id} data={user} />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
