import  { useState, useId} from "react";
import './Filter.css'
import { useFilters } from "../../hooks/useFilters.js";

export function  Filter  ()  {

  const {filters, setFilters}=useFilters()
    const [minPrice, setMinPrice]=useState(0);
    const minPriceFilterId= useId()
   const categoryFilterId= useId()


    const handleChangeMinPrice= (event)=>{
        setMinPrice(event.target.value)
        setFilters(prevState =>({
            ...prevState,
             minPrice: event.target.value
        }))
    }

const handleChangeCategory= (event)=>{
    setFilters(prevState=>({
        ...prevState,
        category: event.target.value
    }))
}




  return (
    <section className="filters">
      <div>
        <label htmlFor={minPriceFilterId}>Precio a partir de:</label>
        <input type="range" 
        id={minPriceFilterId}
         min="0"
         max="300"
         onChange={handleChangeMinPrice} 
         value={filters.minPrice}/>
         <span>${filters.minPrice}</span>
      </div>







      <div>
        <label htmlFor={categoryFilterId}> Categoría </label>
        <select id={categoryFilterId}  onChange={handleChangeCategory}>
            <option value="all">Todas</option>
            <option value="kit">Kit</option>
            <option value="bombas">Bombas</option>
            <option value="bases">Bases</option>
            <option value="embrague">Embragues</option>
            <option value="tapas">Tapas</option>
            <option value="cigueñal">Cigueñal</option>
            <option value="bujes">Bujes</option>
            <option value="mozo">Mozos</option>
            <option value="sensors">Sensores</option>
            <option value="valvulas">Valvulas</option>
            <option value="valvulas">Purificadores</option>
            <option value="tomas">Tomas de Agua</option>
            <option value="alternador">Alternadores</option>



        </select>
      </div>
    </section>
  );
}

export default Filter