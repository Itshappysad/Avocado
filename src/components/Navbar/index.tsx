import { Button, Container, Nav, Navbar as NavbarBs } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { Settings } from "../Settings";
import { useModal } from "./hooks";
import { useAuth } from "../../context/useAuth";
import "./styles.css";

export function Navbar() {
  const { openCart, cartQuantity } = useShoppingCart();
  const { isOpen, handleOpen, handleClose } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <NavbarBs className="bg-white shadow-sm mb-3 z-30 sticky top-0">
      <Container>
        <a className="navbar-title-link" href="/">
          <h1 className="navbar-title font-sofia font-bold text-5xl">
            Avocado -e- Vestiti
          </h1>
        </a>

        <Nav className="me-px font-semibold text-2xl ">
          <Nav.Link to="/store" as={NavLink}>
            Productos
          </Nav.Link>
        </Nav>

        <div className="d-flex justify-content-space-between ">
          {cartQuantity > 0 && (
            <Button
              onClick={openCart}
              style={{
                width: "3rem",
                height: "3rem",
                position: "relative",
                gap: ".5rem",
                marginRight: ".5rem",
              }}
              variant="outline-secondary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                fill="currentColor"
              >
                <path d="M96 0C107.5 0 117.4 8.19 119.6 19.51L121.1 32H541.8C562.1 32 578.3 52.25 572.6 72.66L518.6 264.7C514.7 278.5 502.1 288 487.8 288H170.7L179.9 336H488C501.3 336 512 346.7 512 360C512 373.3 501.3 384 488 384H159.1C148.5 384 138.6 375.8 136.4 364.5L76.14 48H24C10.75 48 0 37.25 0 24C0 10.75 10.75 0 24 0H96zM128 464C128 437.5 149.5 416 176 416C202.5 416 224 437.5 224 464C224 490.5 202.5 512 176 512C149.5 512 128 490.5 128 464zM512 464C512 490.5 490.5 512 464 512C437.5 512 416 490.5 416 464C416 437.5 437.5 416 464 416C490.5 416 512 437.5 512 464z" />
              </svg>

              <div
                className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
                style={{
                  color: "white",
                  width: "1.5rem",
                  height: "1.5rem",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  transform: "translate(25%, 35%)",
                }}
              >
                {cartQuantity}
              </div>
            </Button>
          )}
          <Button
            onClick={
              user
                ? handleOpen
                : () => {
                    navigate("/signUp");
                  }
            }
            style={{
              width: "3rem",
              height: "3rem",
              position: "relative",
              gap: ".5rem",
            }}
            variant="outline-secondary"
          >
            <svg
              viewBox="2.5 2 31 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="40"
              height="40"
            >
              <title />
              <circle cx="12" cy="8" fill="currentColor" r="4" />
              <path
                d="M20,19v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a6,6,0,0,1,6-6h4A6,6,0,0,1,20,19Z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </div>
      </Container>
      <Settings isOpen={isOpen} handleClose={handleClose} />
    </NavbarBs>
  );
}
