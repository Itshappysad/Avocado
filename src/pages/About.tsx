import React from "react";
import Footer from "../components/Footer";
export function About() {
  return (
    <div  >
      <div className="container mx-auto mt-4 flex flex-wrap  mb-20 ">
        <div className="w-full grow md:w-1/2 lg:w-1/4 p-4">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">¿Quienes Somos?</h2>
            <p className="text-gray-700 text-base">
              Avocado-e-Vestiti es un grupo de programadores que se pusieron de acuerdo para renovar las compras en el mundo de la moda, juntando la programación.
              Haciendo que hoy en día comprar ropa en línea sea muy facil para nuestros clientes.
            </p>
          </div>
        </div>
        <div className="w-full grow md:w-1/2 lg:w-1/4 p-4">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Nuestra Vision</h2>
            <p className="text-gray-700 text-base">
              Nuestra visión es ser una de las compañías líderes en la industria de la moda, ofreciendo una moda de cualidad accesible a varios clientes a los precios muy atractivos.
              Podemos ofrecer a nuestros clientes una opción más sostenible.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/4 p-4">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Nuestra Mision</h2>
            <p className="text-gray-700 text-base">
              Nuestra misión es enriquecer la vida de los consumidores con una propuesta de experiencia nueva, actual y conveniente, colaborando al desarrollo personal.
            </p>
          </div>
        </div>
        <div className="flex-row">                            <img
          src="imgs/AeVlogo.jpeg" alt="logo"
          className="max-h-48  max-y-48 rounded-full float-right" /></div>
        <div className="w-full md:w-1/2 lg:w-1/4 p-4 ">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Valores</h2>
            <p className="text-gray-700 text-base">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                  <path fill="currentColor" d="M9.836 2.034q.168.058.329.136l1.283.632a1.25 1.25 0 0 0 1.104 0l1.283-.632a2.75 2.75 0 0 1 3.682 1.253l.073.162l.063.167l.46 1.353c.125.368.414.656.781.781l1.354.46a2.75 2.75 0 0 1 1.581 3.819l-.631 1.283a1.25 1.25 0 0 0 0 1.104l.631 1.283a2.75 2.75 0 0 1-1.581 3.818l-1.354.46a1.25 1.25 0 0 0-.78.781l-.461 1.354a2.75 2.75 0 0 1-3.818 1.581l-1.283-.631a1.25 1.25 0 0 0-1.104 0l-1.283.631a2.75 2.75 0 0 1-3.818-1.581l-.46-1.354a1.25 1.25 0 0 0-.782-.78l-1.353-.461a2.75 2.75 0 0 1-1.582-3.818l.632-1.283a1.25 1.25 0 0 0 0-1.104l-.632-1.283a2.75 2.75 0 0 1 1.582-3.818l1.353-.46a1.25 1.25 0 0 0 .781-.782l.46-1.353a2.75 2.75 0 0 1 3.49-1.718m5.634 6.935l-5.42 5.42l-1.974-2.37a.75.75 0 1 0-1.152.96l2.5 3a.75.75 0 0 0 1.106.051l6-6a.75.75 0 1 0-1.06-1.06" />
                </svg>
                <span>Responsabilidad social</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                  <path fill="currentColor" d="M9.836 2.034q.168.058.329.136l1.283.632a1.25 1.25 0 0 0 1.104 0l1.283-.632a2.75 2.75 0 0 1 3.682 1.253l.073.162l.063.167l.46 1.353c.125.368.414.656.781.781l1.354.46a2.75 2.75 0 0 1 1.581 3.819l-.631 1.283a1.25 1.25 0 0 0 0 1.104l.631 1.283a2.75 2.75 0 0 1-1.581 3.818l-1.354.46a1.25 1.25 0 0 0-.78.781l-.461 1.354a2.75 2.75 0 0 1-3.818 1.581l-1.283-.631a1.25 1.25 0 0 0-1.104 0l-1.283.631a2.75 2.75 0 0 1-3.818-1.581l-.46-1.354a1.25 1.25 0 0 0-.782-.78l-1.353-.461a2.75 2.75 0 0 1-1.582-3.818l.632-1.283a1.25 1.25 0 0 0 0-1.104l-.632-1.283a2.75 2.75 0 0 1 1.582-3.818l1.353-.46a1.25 1.25 0 0 0 .781-.782l.46-1.353a2.75 2.75 0 0 1 3.49-1.718m5.634 6.935l-5.42 5.42l-1.974-2.37a.75.75 0 1 0-1.152.96l2.5 3a.75.75 0 0 0 1.106.051l6-6a.75.75 0 1 0-1.06-1.06" />
                </svg>
                <span>Honestidad</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                  <path fill="currentColor" d="M9.836 2.034q.168.058.329.136l1.283.632a1.25 1.25 0 0 0 1.104 0l1.283-.632a2.75 2.75 0 0 1 3.682 1.253l.073.162l.063.167l.46 1.353c.125.368.414.656.781.781l1.354.46a2.75 2.75 0 0 1 1.581 3.819l-.631 1.283a1.25 1.25 0 0 0 0 1.104l.631 1.283a2.75 2.75 0 0 1-1.581 3.818l-1.354.46a1.25 1.25 0 0 0-.78.781l-.461 1.354a2.75 2.75 0 0 1-3.818 1.581l-1.283-.631a1.25 1.25 0 0 0-1.104 0l-1.283.631a2.75 2.75 0 0 1-3.818-1.581l-.46-1.354a1.25 1.25 0 0 0-.782-.78l-1.353-.461a2.75 2.75 0 0 1-1.582-3.818l.632-1.283a1.25 1.25 0 0 0 0-1.104l-.632-1.283a2.75 2.75 0 0 1 1.582-3.818l1.353-.46a1.25 1.25 0 0 0 .781-.782l.46-1.353a2.75 2.75 0 0 1 3.49-1.718m5.634 6.935l-5.42 5.42l-1.974-2.37a.75.75 0 1 0-1.152.96l2.5 3a.75.75 0 0 0 1.106.051l6-6a.75.75 0 1 0-1.06-1.06" />
                </svg>
                <span>Creatividad</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                  <path fill="currentColor" d="M9.836 2.034q.168.058.329.136l1.283.632a1.25 1.25 0 0 0 1.104 0l1.283-.632a2.75 2.75 0 0 1 3.682 1.253l.073.162l.063.167l.46 1.353c.125.368.414.656.781.781l1.354.46a2.75 2.75 0 0 1 1.581 3.819l-.631 1.283a1.25 1.25 0 0 0 0 1.104l.631 1.283a2.75 2.75 0 0 1-1.581 3.818l-1.354.46a1.25 1.25 0 0 0-.78.781l-.461 1.354a2.75 2.75 0 0 1-3.818 1.581l-1.283-.631a1.25 1.25 0 0 0-1.104 0l-1.283.631a2.75 2.75 0 0 1-3.818-1.581l-.46-1.354a1.25 1.25 0 0 0-.782-.78l-1.353-.461a2.75 2.75 0 0 1-1.582-3.818l.632-1.283a1.25 1.25 0 0 0 0-1.104l-.632-1.283a2.75 2.75 0 0 1 1.582-3.818l1.353-.46a1.25 1.25 0 0 0 .781-.782l.46-1.353a2.75 2.75 0 0 1 3.49-1.718m5.634 6.935l-5.42 5.42l-1.974-2.37a.75.75 0 1 0-1.152.96l2.5 3a.75.75 0 0 0 1.106.051l6-6a.75.75 0 1 0-1.06-1.06" />
                </svg>
                <span>Calidad</span>
              </div>
            </p>
          </div>
        </div>
        <div className="w-full grow md:w-1/2 lg:w-1/4 p-4 ">
          <div className="max-w-lg mx-auto  bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Historia</h2>
            <p className="text-gray-700 text-base">
              Avocado-e-Vestiti empieza como una idea de 3 adolescentes jugando; con el pasar de los tiempos va avanzando hasta tener en claro esa idea de emprender.
              Los 3 jóvenes, salidos de grados 10, empiezan a programar e idear cómo sería la empresa hasta él hoy en día.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/4 p-4">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Equipo</h2>
            <p className="text-gray-700 text-base">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19.717 20.362C21.143 19.585 22 18.587 22 17.5c0-1.152-.963-2.204-2.546-3C17.623 13.58 14.962 13 12 13c-2.962 0-5.623.58-7.454 1.5C2.963 15.296 2 16.348 2 17.5s.963 2.204 2.546 3C6.377 21.42 9.038 22 12 22c3.107 0 5.882-.637 7.717-1.638" opacity=".6" />
                  <path fill="currentColor" fillRule="evenodd" d="M9.25 4a2.75 2.75 0 1 1 5.5 0a2.75 2.75 0 0 1-5.5 0" clipRule="evenodd" />
                  <path fill="currentColor" d="m8.223 11.574l-2.175-.725a1.532 1.532 0 0 1 .805-2.952l1.898.407l.21.044a15 15 0 0 0 6.288-.044l1.897-.407a1.532 1.532 0 0 1 .806 2.952l-2.175.725c-.263.088-.394.132-.493.193a1 1 0 0 0-.466.986c.016.115.066.244.165.503l1.247 3.242a1.473 1.473 0 0 1-2.654 1.26L12 15l-1.576 2.757a1.473 1.473 0 0 1-2.654-1.26l1.247-3.241c.1-.259.149-.388.165-.503a1 1 0 0 0-.466-.986c-.099-.061-.23-.105-.493-.193" />
                </svg>
                <span>Juan Esteban Sierra</span>
              </div>                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19.717 20.362C21.143 19.585 22 18.587 22 17.5c0-1.152-.963-2.204-2.546-3C17.623 13.58 14.962 13 12 13c-2.962 0-5.623.58-7.454 1.5C2.963 15.296 2 16.348 2 17.5s.963 2.204 2.546 3C6.377 21.42 9.038 22 12 22c3.107 0 5.882-.637 7.717-1.638" opacity=".6" />
                  <path fill="currentColor" fillRule="evenodd" d="M9.25 4a2.75 2.75 0 1 1 5.5 0a2.75 2.75 0 0 1-5.5 0" clipRule="evenodd" />
                  <path fill="currentColor" d="m8.223 11.574l-2.175-.725a1.532 1.532 0 0 1 .805-2.952l1.898.407l.21.044a15 15 0 0 0 6.288-.044l1.897-.407a1.532 1.532 0 0 1 .806 2.952l-2.175.725c-.263.088-.394.132-.493.193a1 1 0 0 0-.466.986c.016.115.066.244.165.503l1.247 3.242a1.473 1.473 0 0 1-2.654 1.26L12 15l-1.576 2.757a1.473 1.473 0 0 1-2.654-1.26l1.247-3.241c.1-.259.149-.388.165-.503a1 1 0 0 0-.466-.986c-.099-.061-.23-.105-.493-.193" />
                </svg>
                <span>Andres Martinez Martinez</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19.717 20.362C21.143 19.585 22 18.587 22 17.5c0-1.152-.963-2.204-2.546-3C17.623 13.58 14.962 13 12 13c-2.962 0-5.623.58-7.454 1.5C2.963 15.296 2 16.348 2 17.5s.963 2.204 2.546 3C6.377 21.42 9.038 22 12 22c3.107 0 5.882-.637 7.717-1.638" opacity=".6" />
                  <path fill="currentColor" fillRule="evenodd" d="M9.25 4a2.75 2.75 0 1 1 5.5 0a2.75 2.75 0 0 1-5.5 0" clipRule="evenodd" />
                  <path fill="currentColor" d="m8.223 11.574l-2.175-.725a1.532 1.532 0 0 1 .805-2.952l1.898.407l.21.044a15 15 0 0 0 6.288-.044l1.897-.407a1.532 1.532 0 0 1 .806 2.952l-2.175.725c-.263.088-.394.132-.493.193a1 1 0 0 0-.466.986c.016.115.066.244.165.503l1.247 3.242a1.473 1.473 0 0 1-2.654 1.26L12 15l-1.576 2.757a1.473 1.473 0 0 1-2.654-1.26l1.247-3.241c.1-.259.149-.388.165-.503a1 1 0 0 0-.466-.986c-.099-.061-.23-.105-.493-.193" />
                </svg>
                <span>Nicolas Lopez</span>
              </div>
            </p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}