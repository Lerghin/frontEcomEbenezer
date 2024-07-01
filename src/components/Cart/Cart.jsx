import './Cart.css'

import { useId, useState, useEffect  } from 'react'
import { useNavigate } from 'react-router-dom';
import { CartIcon, ClearCartIcon } from './../Icons.jsx'
import { useCart } from './../../hooks/useCart.js'

function CartItem ({ thumbnail, price, title, quantity, addToCart, stock }) {


  const totalPrice = price * quantity;


  const [subTotalPrice, setSubTotalPrice] = useState(totalPrice); // Initialize state
 
  
  const handleyChange = (event) => {
    const newQuantity = Number(event.target.value);
    if (isNaN(newQuantity) || newQuantity < 0) return;

    setSubTotalPrice(price * newQuantity);
  }
  return (
    <li>
      <img
        src={thumbnail}
        alt={title}
      />
      <div>
        <strong>{title}</strong>${price}
      </div>

      <footer>
        <small   >
          Qty: {quantity}
        </small>
        <button onClick={addToCart} disabled={quantity >= stock}>+</button>
        <div onChange={ handleyChange}> ${totalPrice.toFixed(2)}</div>
      </footer>
    </li>
  )
}

export function Cart () {
  const cartCheckboxId = useId()
 
  const { cart, clearCart, addToCart } = useCart()
  const [route, setRoute] = useState('cart');
  const navigate = useNavigate();
 

 
  const totalPrice = cart.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
  
  useEffect(() => {
    if (route === 'signin') {
      navigate('/signin');
    }
  }, [route]);

  
  return (
    <>
      <label className='cart-button' htmlFor={cartCheckboxId}>
        <CartIcon />
      </label>
      <input id={cartCheckboxId} type='checkbox' hidden />

      <aside className='cart'>
        <ul style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }} >
        {cart.map(product => (
            <CartItem
              key={product._id}
              addToCart={() => addToCart(product)}
           
              {...product}
            />
          ))}
        </ul>
        <h5>Total: ${totalPrice.toFixed(2)}</h5>
        <button className='button-cart' onClick={clearCart}>
          <ClearCartIcon />
        </button>
        <button className="btn btn-primary" type="submit" onClick={(e) => {
          e.preventDefault();
          sessionStorage.setItem('cartData', JSON.stringify(cart));
          setRoute('signin');
        }}>
        Ir a la Compra
      </button>
              
      </aside>

    </>
  )
}