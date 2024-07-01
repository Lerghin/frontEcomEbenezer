import Main from "../../components/Main/Main";
import '../Home/home.css';
import { useEffect, useState } from "react";
import { useFilters } from './../../hooks/useFilters';

import { API } from "../../utils/axios";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { ProductAdmin } from "../../components/Products/productAdmin";

const Productos = () => {
  const [products, setProducts] = useState([]);
 
  const { filterProducts } = useFilters();
 const navigate=useNavigate()
  useEffect(() => {
    API.get('/products')
      .then(res => {
        setProducts(res.data.response);
        //console.log(res.data.response)
    
      })
      .catch(error => console.log(error));
  }, []);


  const filteredProducts = filterProducts(products);
  //console.log("Productos filtrados:", filteredProducts);

  return (
    <div className="app-layout">
      
  
        <div className="container app-main">
       
          <Main /> <Button onClick={() => navigate('/addProducto')} variant="btn btn-secondary"> Agregar Producto  <IoIosAdd /> </Button>
       <br /><br />
       </div>
        
        <ProductAdmin key={products._id} products={filteredProducts}  />
      
    
    </div>
  );
};

export default Productos;