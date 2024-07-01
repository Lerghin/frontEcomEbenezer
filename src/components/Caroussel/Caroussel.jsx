
import React, { useEffect, useState } from "react";
import  '../Caroussel/carussel.css';
import { imagenes } from '../../data/imagenes';

const Caroussel = () => {


   
    const [contadores, setContadores] = useState([0,1,2,3]);
     const cantImagenes= 4;
    
  
     const prev = () => {
      const maxContador = imagenes.length - 1;
      const prevContadores = contadores.map((contador) => contador - 4);

      setContadores(prevContadores.map((contador) => contador < 0 ? maxContador + contador + 1 : contador ));
    
    };
    
    const next = () => {
      const maxContador = imagenes.length - 1;
      const nextContadores = contadores.map((contador) => contador + 4);
      setContadores(
        nextContadores.map((contador) => (contador > maxContador ? contador - maxContador - 1 : contador))
      );
    };
    
  

    return (
      <div className="carousel">
        <button className="btn btn-dark" onClick={prev}>
          Prev
        </button>
        <div  className="carousel-img">
          {contadores.map((contador,index) => (
            <div  className="centrado" key={index} >
              <img  src={imagenes[contador].src} alt={imagenes[contador].alt} />
              <span>{imagenes[contador].alt}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-dark" onClick={next}>
          Next
        </button>
      </div>
  )
}

export default Caroussel
