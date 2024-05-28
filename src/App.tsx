import { Container } from "react-bootstrap";
import { Navbar } from "./components/Navbar";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <ShoppingCartProvider>
      <Navbar />
      <Container className="brd h-dvh">
        <Outlet />
      </Container>
    </ShoppingCartProvider>
  );
}

export default App;

/* https://www.youtube.com/watch?v=lATafp15HWA refference*/
