import { Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Button } from "./ui/button";
import ProfilePicture from "./ProfilePic";

type SettingsProps = {
  isOpen: boolean;
  handleClose: () => void;
};

export function Settings({ isOpen, handleClose }: SettingsProps) {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  return (
    <Offcanvas show={isOpen} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton></Offcanvas.Header>

      <div className="flex flex-col items-center h-full relative mx-10">
        {!user ? (
          <button
            className="
                    py-2 px-3 bg-blue-600 font-bold rounded-xl text-white transition-transform
                    hover:bg-gray-400
                    active:scale-95
                    disabled:bg-lime-900
                  "
          >
            <Link className="no-underline text-white w-max h-max" to="/signUp">
              Registrate!
            </Link>
          </button>
        ) : (
          <>
            <p className="text-4xl font-bold text-center">{user.name}</p>
            <ProfilePicture id={user.id} />
            <div className="flex flex-col gap-2">
              <Button
                className="text-decoration-none text-gray-600"
                asChild
                variant="outline"
              >
                <Link to="/account/edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="currentColor"
                      d="M234.38 210a123.36 123.36 0 0 0-60.78-53.23a76 76 0 1 0-91.2 0A123.36 123.36 0 0 0 21.62 210a12 12 0 1 0 20.77 12c18.12-31.32 50.12-50 85.61-50s67.49 18.69 85.61 50a12 12 0 0 0 20.77-12M76 96a52 52 0 1 1 52 52a52.06 52.06 0 0 1-52-52"
                    />
                  </svg>
                  Tu cuenta
                </Link>
              </Button>
              <Button
                className="text-decoration-none text-gray-600"
                asChild
                variant="outline"
              >
                <Link to="/Company/edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <g id="office" fill="currentColor">
                      <path d="M12.5,13h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,12.5,13Z" />
                      <path d="M12.5,9h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,12.5,9Z" />
                      <path d="M12.5,5h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,12.5,5Z" />
                      <path d="M8.5,13h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,8.5,13Z" />
                      <path d="M8.5,9h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,8.5,9Z" />
                      <path d="M8.5,5h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,8.5,5Z" />
                      <path d="M16.5,13h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,16.5,13Z" />
                      <path d="M16.5,9h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,16.5,9Z" />
                      <path d="M16.5,5h-1a1,1,0,0,0,0,2h1A1,1,0,0,0,16.5,5Z" />
                      <path d="M22,21H21V2a1,1,0,0,0-1-1H4A1,1,0,0,0,3,2V21H2a1,1,0,0,0,0,2H22A1,1,0,0,0,22,21ZM10,21V19h4v2Zm6,0V18a1,1,0,0,0-1-1H9a1,1,0,0,0-1,1v3H5V3H19V21Z" />
                    </g>
                  </svg>{" "}
                  Empresa
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await logOut();
                  navigate("/signUp");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4q0 .425-.288.713T11 5H5v14h6q.425 0 .713.288T12 20q0 .425-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12q0-.425.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7q.275-.3.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"
                  />
                </svg>
                Cerrar sesión
              </Button>
            </div>
          </>
        )}
      </div>
    </Offcanvas>
  );
}
