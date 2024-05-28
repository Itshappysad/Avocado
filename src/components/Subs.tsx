import { Link } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { Button } from "./ui/button";
import type { Subscription } from "../core/types";

type SubsItemsProps = {
  Subscription: Subscription;
};
export function Subsitems({ Subscription }: SubsItemsProps) {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const { id } = Subscription;
  const quantity = getItemQuantity(id);

  return (
    <div className="grid gap-0.1 grid-cols-3 h-124 w-full place-items-center rounded-lg mb-40">
      <div className="flex flex-col items-center h-full relative w-64 rounded-lg shadow-xl bg-white ">
        <h1 className="shadow-inner hover:bg-gray-100">Mensual</h1>
        Incluye:
        <ol className="italic hover:text-gray-500 transition ease-in-out delay-150">
          <li>&#x2713; Lorem</li>
          <li>&#x2713; Ipsum</li>
          <li>&#x2713; dolor </li>
          <li>&#x2715; sit</li>
          <li>&#x2715; amet</li>
          <li>&#x2715; consectetur </li>
          <li>&#x2715; adipiscing </li>
          <li>&#x2715; elit</li>
          <li>&#x2715; sed </li>
        </ol>
        <h2>$15.000</h2>
        <p className="text-xs	">Por mes</p>
        {quantity === 0 ? (
          <Button
            className="text-decoration-none text-gray-600"
            asChild
            variant="outline"
            /*onClick={() => increaseCartQuantity(id )}*/
          >
            <Link to="">
              <b>&#xFF04;</b> Suscribirse!
            </Link>
          </Button>
        ) : (
          <div
            className="d-flex align-items-center flex-column"
            style={{ gap: ".5rem" }}
          >
            <div
              className="d-flex align-items-center justify-content-center "
              style={{ gap: ".5rem" }}
            >
              <Button /* onClick={() => decreaseCartQuantity(id)} */>-</Button>
              <div>
                <span className="fs-3">{quantity}</span> en el carro
              </div>
              <Button /* onClick={() => increaseCartQuantity(id)}*/>+</Button>
            </div>

            <Button
              /*   onClick={() => removeFromCart(id)}*/
              variant="destructive"
              size="sm"
            >
              {" "}
              Remover
            </Button>
          </div>
        )}
      </div>
      <div className=" flex flex-col items-center h-full relative w-64  rounded-lg shadow-xl bg-white ">
        <h1 className="shadow-inner  hover:bg-gray-100 hover:text-blue-500 transition ease-in-out delay-150">
          Mensual +
        </h1>
        Incluye:
        <ol className="italic hover:text-gray-500 transition ease-in-out delay-150 ">
          <li>&#x2713; Lorem</li>
          <li>&#x2713; Ipsum</li>
          <li>&#x2713; dolor </li>
          <li>&#x2713; sit</li>
          <li>&#x2713; amet</li>
          <li>&#x2715; consectetur </li>
          <li>&#x2715; adipiscing </li>
          <li>&#x2715; elit</li>
          <li>&#x2715; sed </li>
        </ol>
        <h2>$22.000</h2>
        <p className="text-xs">Por mes</p>
        {quantity === 0 ? (
          <Button
            className="text-decoration-none text-gray-600"
            asChild
            variant="outline"
            /* onClick={() => increaseCartQuantity(id)}*/
          >
            <Link to="">
              <b>&#xFF04;</b> Suscribirse!
            </Link>
          </Button>
        ) : (
          <div
            className="d-flex align-items-center flex-column"
            style={{ gap: ".5rem" }}
          >
            <div
              className="d-flex align-items-center justify-content-center "
              style={{ gap: ".5rem" }}
            >
              <Button /* onClick={() => decreaseCartQuantity(id)}*/>-</Button>
              <div>
                <span className="fs-3">{quantity}</span> en el carro
              </div>
              <Button /* onClick={() => increaseCartQuantity(id)}*/>+</Button>
            </div>

            <Button
              /*   onClick={() => removeFromCart(id)}*/
              variant="destructive"
              size="sm"
            >
              {" "}
              Remover
            </Button>
          </div>
        )}
      </div>
      <div className=" flex flex-col items-center h-full relative w-64  rounded-lg shadow-xl bg-white ">
        <h1 className=" shadow-inner  hover:bg-gray-100 hover:text-yellow-500  transition ease-in-out delay-150">
          Anual
        </h1>
        Incluye:
        <ol className="italic hover:text-gray-500 transition ease-in-out delay-150">
          <li>&#x2713; Lorem</li>
          <li>&#x2713; Ipsum</li>
          <li>&#x2713; dolor </li>
          <li>&#x2713; sit</li>
          <li>&#x2713; amet</li>
          <li>&#x2713; consectetur </li>
          <li>&#x2713; adipiscing </li>
          <li>&#x2713; elit</li>
          <li>&#x2713; sed </li>
        </ol>
        <h2>$240.000</h2>
        <p className="text-xs	">Por año</p>
        {quantity === 0 ? (
          <Button
            className="text-decoration-none text-gray-600"
            asChild
            variant="outline"
            /* onClick={() => increaseCartQuantity(id)}*/
          >
            <Link to="">
              <b>&#xFF04;</b> Suscribirse!
            </Link>
          </Button>
        ) : (
          <div
            className="d-flex align-items-center flex-column"
            style={{ gap: ".5rem" }}
          >
            <div
              className="d-flex align-items-center justify-content-center "
              style={{ gap: ".5rem" }}
            >
              <Button
              /* onClick={() => decreaseCartQuantity(id)} */
              >
                -
              </Button>
              <div>
                <span className="fs-3">{quantity}</span> en el carro
              </div>
              <Button /* onClick={() => increaseCartQuantity(id)}*/>+</Button>
            </div>

            <Button
              /*   onClick={() => removeFromCart(id)}*/
              variant="destructive"
              size="sm"
            >
              {" "}
              Remover
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subsitems;

/*,

  add to somewhere items or dsmth*/
