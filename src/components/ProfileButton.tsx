import { Button } from "../components/ui/button";
import { useRef } from "react";
import useProfilePicture from "../hooks/useProfilePicture";

type Props = {
  id: string;
};

const ProfilePictureButtons = ({ id }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadProfilePicture } = useProfilePicture(id);

  return (
    <div>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        onChange={uploadProfilePicture}
        id="imageUpload"
        ref={fileInputRef}
      />
      <label htmlFor="imageUpload">
        <Button
          type="button"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          Cambiar foto
        </Button>
      </label>
    </div>
  );
};

export default ProfilePictureButtons;
