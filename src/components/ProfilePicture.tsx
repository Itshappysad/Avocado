import { useRef } from "react";
import { Camera } from "lucide-react";
import { useStorageImage } from "../hooks/useStorageImage";
import { imagePaths } from "../core/storage";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { cn } from "../core/utils";

type ProfilePictureProps = {
  userId: string;
  /** Muestra el botón para cambiar la foto. */
  editable?: boolean;
  className?: string;
};

export function ProfilePicture({
  userId,
  editable = false,
  className,
}: ProfilePictureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { url, isLoading, upload, isUploading } = useStorageImage(
    imagePaths.profile(userId),
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          "grid size-40 place-items-center overflow-hidden rounded-full border bg-neutral-100 shadow-sm",
          className,
        )}
      >
        {isLoading || isUploading ? (
          <Spinner />
        ) : (
          <img
            src={url ?? "/imgs/AeVlogo.jpeg"}
            alt="Foto de perfil"
            className="size-full object-cover"
          />
        )}
      </div>

      {editable && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="mr-2 size-4" />
            Cambiar foto
          </Button>
        </>
      )}
    </div>
  );
}
