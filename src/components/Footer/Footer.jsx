
import '../Footer/footer.css'

import { FaInstagram } from "react-icons/fa6";
import { FaMobileAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { SiFord } from "react-icons/si";

//import { useFilters } from "../hooks/useFilters.js";
//import { useCart } from "../hooks/useCart.js";

const Footer = () => {
 /// const { filters } = useFilters();
 // const { cart } = useCart();
  return (
  
    <footer className="footer">
    {/*
 {
  JSON.stringify(filters, null, 2)
 }
 */}
    {/*

{
JSON.stringify(cart, null, 2)
}
*/}
  <h2 > <SiFord /></h2> 
    <h4>
      Repuestos Ebenezer C.A. 
    </h4>
   
    <span><FaMobileAlt /> <Link to="https://api.whatsapp.com/send/?phone=%2B584123675863&text&type=phone_number&app_absent=0"> 04241946683</Link></span>
    <br />
    <span><FaInstagram /><Link to="https://www.instagram.com/repuestos_ebenezer/?hl=es"> REPUESTOS_EBENEZER
    </Link> </span>
    
  </footer>
  )
}

export default Footer
