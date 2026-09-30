import { Link, useNavigate } from "react-router-dom";
import { Building2, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ProfilePicture } from "./ProfilePicture";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

type AccountSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Panel lateral con el perfil y accesos a la cuenta y a la empresa. */
export function AccountSheet({ open, onOpenChange }: AccountSheetProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-sm">
        <SheetHeader>
          <SheetTitle>Mi cuenta</SheetTitle>
          <SheetDescription className="sr-only">
            Accesos a tu perfil y a tu empresa
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col items-center gap-6 p-6">
          <ProfilePicture userId={user.id} />
          <div className="text-center">
            <p className="text-2xl font-bold">{user.name}</p>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/account" onClick={close}>
                <UserRound className="mr-2 size-4" />
                Mi cuenta
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/company" onClick={close}>
                <Building2 className="mr-2 size-4" />
                Mi empresa
              </Link>
            </Button>
          </div>

          <Button
            variant="destructive"
            className="mt-auto w-full"
            onClick={async () => {
              await signOut();
              close();
              navigate("/");
            }}
          >
            <LogOut className="mr-2 size-4" />
            Cerrar sesión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
