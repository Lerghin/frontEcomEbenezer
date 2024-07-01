import { useContext, useEffect, useState } from "react";
import "./Products.css";
import { AddToCartIcon, RemoveFromCartIcon } from "./../Icons.jsx";
import { CartContext } from "../context/cart.jsx";
import { LS } from "../../utils/LS.js";
import axios from "axios";

export function Products({ products }) {
  const { addToCart, cart, removeFromCart } = useContext(CartContext);
  const [userRole, setUserRole] = useState(null);
  const [montoBs, setMontoBs] = useState(0);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await axios.get("https://v6.exchangerate-api.com/v6/8ee293f7c8b83cfe4baa699c/latest/USD");
        const valorDollar = res.data.conversion_rates.VES;
        setMontoBs(valorDollar);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };
    fetchExchangeRate();
  }, []);

  const checkProductInCart = product => {
    return cart.some(item => item._id === product._id);
  };

  useEffect(() => {
    try {
      const role = LS.getText("role")?.trim();
      if (role) {
        setUserRole(role);
      } else {
        setUserRole("GUEST");
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      setUserRole("GUEST");
    }
  }, []);

  return (
    <main className="products">
      <ul>
        {products
          .filter(product => product.isActive) // Filtramos los productos activos
          .slice(0, 30)
          .map((product) => {
            const isProductInCart = checkProductInCart(product);
            const isOutOfStock = product.stock === 0;

            return (
              <div key={product._id}>
                <li>
                  <img className="imagen-card" src={product.thumbnail} alt={product.name} />
                  <div style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                    <strong>{product.name}</strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>
                    <strong>Descripción:</strong> {product.description}
                  </div>
                  <div><strong>Precio en USD:</strong> {product.price}$</div>
                  <div><strong>Total en Bs:</strong> {(parseFloat(montoBs) * product.price).toFixed(2)} Bs</div>
                  <div><strong>Cantidad Disponible:</strong> {product.stock}</div>

                  <div className="product-actions2">
                    {userRole !== 'ADMIN' && (
                      <button
                        style={{
                          backgroundColor: isOutOfStock ? "#ccc" : isProductInCart ? "red" : "#09f",
                          cursor: isOutOfStock ? "not-allowed" : "pointer",
                        }}
                        onClick={() => {
                          if (!isOutOfStock) {
                            isProductInCart ? removeFromCart(product) : addToCart(product);
                          }
                        }}
                        disabled={isOutOfStock}
                      >
                        {isOutOfStock ? (
                          <span>Agotado</span>
                        ) : isProductInCart ? (
                          <RemoveFromCartIcon />
                        ) : (
                          <AddToCartIcon />
                        )}
                      </button>
                    )}
                  </div>
                </li>
              </div>
            );
          })}
      </ul>
    </main>
  );
}
