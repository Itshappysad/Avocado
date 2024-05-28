import "./Footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="content">
          <div>
            <h5>Contacto</h5>
            <a
              href="https://www.instagram.com/avocadoevestiti/"
              target="_blank"
            >
              Instagram
            </a>
          </div>
          <div>
            <h5>Información</h5>
            <a href="/About">Sobre nosotros</a>
          </div>
          <div>
            <h5>Soporte</h5>
            <a
              href="https://www.instagram.com/avocadoevestiti/"
              target="_blank"
            >
              Servicio al cliente
            </a>
          </div>
        </div>
        <p>©2024 Avocado e Vestiti Incorporated</p>
      </div>
    </>
  );
};

export default Footer;
