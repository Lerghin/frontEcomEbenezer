import Main from "../../components/Main/Main";
import '../Home/home.css';
import { CartProvider } from "../../components/context/cart";
import { useEffect, useState } from "react";
import { useFilters } from './../../hooks/useFilters';
import { Products } from './../../components/Products/Products';
import { Cart } from "./../../components/Cart/Cart";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { filterProducts } = useFilters();

  useEffect(() => {
    axios.get('http://localhost:4000/api/products')
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
      
      <CartProvider>
        <div className="container app-main">
       
          <Main />
        </div>
       <div className="productos">
        <Products key={products._id} products={filteredProducts} />
        </div>
        <Cart />

      </CartProvider>
    </div>
  );
};

export default Home;