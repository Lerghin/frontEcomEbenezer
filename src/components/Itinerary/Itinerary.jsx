import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import '../Itinerary/itinerary.css';
import { BiMoney } from 'react-icons/bi';
import { AiFillHeart } from 'react-icons/ai';
import { BiTime } from 'react-icons/bi';






const Itinerary = () => {
  const params = useParams();
  const [city, setCity] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/cities/${params.id}`)
      .then(res => {
        setCity(res.data.response.itinerary);
      })
      .catch(error => console.log(error));
  }, [params.id]);

  useEffect(() => {
    if (city) {
      axios.get(`http://localhost:4000/api/itineraries/${city}`)
        .then(res => {
          const itinerary1 = res.data.response;
          let array = [];

          if (Array.isArray(itinerary1)) {
            array = itinerary1.flatMap(itinerary1 => itinerary1);
          } else {
            array = [itinerary1];
          }
          setItinerary(array);
          console.log(array);
          console.log(array[0].personName); 
        })
        .catch(error => console.log(error));
    }
  }, [city]);

  if (!city || !itinerary) {
    return <p>Cargando...</p>;
  }

  return (



    <Table responsive borderless   variant="dark rounded-circle"  >
     
      <thead >
        <tr  variant="dark"   >
          <th></th>
          <th>Name</th>
          <th><AiFillHeart/> </th>
          <th > <BiMoney/> </th>
          <th> <BiMoney/> <BiMoney/></th>
          <th> <BiMoney/> <BiMoney/> <BiMoney/></th>

          <th> <BiTime/>Duration</th>
          <th>Hashtags</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {itinerary.map(item => (
          <tr key={item._id}>
            <td><img src={item.personImage} alt={item.personName} style={{ width: '150px', height: '100px' }} /></td>
            <td>{item.personName}</td>
            <td>{item.likes} </td>
            <td>{item.price1}  </td>
            <td>{item.price2}  </td>
            <td>{item.price3}  </td>
        
            <td>{item.duration} days</td>
            <td>#{item.hashtags.join('#')}</td>
            <td><Button variant="primary"> View More</Button></td>
          </tr>
        ))}
      </tbody>
    </Table>
   
   
  );
}

export default Itinerary;