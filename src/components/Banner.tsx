const Banner = () => {
  return (
    <div className="container relative">
      {/* TODO: apuntar link a producto con descuento */}
      <a href="" className="text-decoration-line: none">
        <img
          className="grid__item-image saturate-50 js-grid__item-image grid__item-image-lazy js-lazy grid__item-trigger image-loaded relative w-full  h-full  object-cover shadow-sm  place-items-stretch rounded "
          loading="lazy"
          src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/ec50c4129529089.616ef0ece9ea5.gif"
          alt=""
          id="108798887"
          srcSet="https://mir-s3-cdn-cf.behance.net/project_modules/disp/ec50c4129529089.616ef0ece9ea5.gif 600w,https://mir-s3-cdn-cf.behance.net/project_modules/fs/ec50c4129529089.616ef0ece9ea5.gif 1350w,https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/ec50c4129529089.616ef0ece9ea5.gif 1200w,"
          sizes="975px"
          data-sizes="975px"
        />
        <p className="text-white tracking-tighter	 skew-y-3 shadow-xl  absolute translate-x-80 top-10 text-center font-extralight text-7xl">
          Compralo Aqui
        </p>
      </a>
    </div>
  );
};

export default Banner;
