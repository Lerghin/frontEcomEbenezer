
import NavbarMain from '../../components/Navbar/NavbarMain';
import Footer from '../../components/Footer/Footer'
import { Outlet } from 'react-router-dom';






const Loyaut = () => {



  return (
      <div className="app-layout">
    <header className=" app-header">
      <NavbarMain />
    </header>
    <Outlet/>

  <footer className=" app-footer"> <Footer /></footer>  
  </div>
  )
}

export default Loyaut
