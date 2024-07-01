import './Products.css';
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { API } from '../../utils/axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function ProductAdmin({ products }) {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [montoBs, setMontoBs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://v6.exchangerate-api.com/v6/8ee293f7c8b83cfe4baa699c/latest/USD");
        const valorDollar = res.data.conversion_rates.VES;
        setMontoBs(valorDollar);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Función para manejar la desactivación/activación del producto
  const handleToggleActive = async (id, isActive) => {
    try {
      // Actualizar el estado `isActive` del producto en la base de datos
      await API.put(`/products/${id}`, { isActive: !isActive });
      
      toast.success(`Producto ${!isActive ? 'activado' : 'desactivado'} con éxito`);
      
      // Actualizar el estado local del producto
      setProductList(productList.map(product =>
        product._id === id ? { ...product, isActive: !isActive } : product
      ));
    } catch (error) {
      toast.error('Error al actualizar el estado del producto');
      console.error(error);
    }
  };

  // Función para navegar a la página de edición
  const handleEdit = (id) => {
    navigate(`/editProduct/${id}`);
  };

  useEffect(() => {
    // Actualizar la lista de productos con los recibidos como prop
    setProductList(products);
  }, [products]);

  return (
    <main className='products'>
      <ul>
        {productList.slice(0, 30).map(product => {
          return (
            <div key={product._id} className="product-card">
              <li>
                <img src={product.thumbnail} alt={product.name} />
                <div>
                  <strong>Nombre: {product.name}</strong>
                </div>
                <div>
                  <strong>Categoría: {product.category}</strong>
                </div>
                <div>
                  <strong>Precio en USD: </strong> {product.price} $
                </div>
                <div>
                  <strong>Total en Bs:</strong> {(parseFloat(montoBs) * product.price).toFixed(2)} Bs
                </div>
                <div>
                  <strong>Stock Disponible: </strong>{product.stock}
                </div>
                <div className="product-actions">
                  <button 
                    className="edit-button" 
                    onClick={() => handleEdit(product._id)}
                  >
                    <FaUserEdit /> Editar
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={() => handleToggleActive(product._id, product.isActive)}
                  >
                    <MdDeleteForever /> {product.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </li>
            </div>
          );
        })}
      </ul>
    </main>
  );
}
