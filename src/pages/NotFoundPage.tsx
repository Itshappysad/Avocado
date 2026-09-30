import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/ui/empty-state";

export default function NotFoundPage() {
  return (
    <EmptyState
      className="my-16"
      title="Página no encontrada"
      description="La dirección que buscas no existe o fue movida."
      action={
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      }
    />
  );
}
