
import { useContext } from 'react'
import { FiltersContext } from './../components/context/filter.jsx'

export function useFilters(){

  // const[filters, setFilters]= useState({
 
    // category: 'all',
    // minPrice: 0,
 
  // })
 
   const {filters, setFilters}= useContext(FiltersContext)
  
 
  const filterProducts=(products)=> {
    console.log("Productos antes del filtro:", products);
   return products.filter(product=> {
      return (
        product.price>= filters.minPrice &&
       (
         filters.category=='all' ||
         product.category== filters.category
       )
     )
  })
 }
 
 return {filters, filterProducts, setFilters }
 
 }