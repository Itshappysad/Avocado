import { Button } from "../components/ui/button";
import { useRef } from "react";
import useCompanyPicture from "../hooks/useCompanyPicture";

type Props = {
  id: string;
};

const CompanyPictureButtons = ({ id }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadCompanyPicture } = useCompanyPicture(id);

  return (
    <div>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        onChange={uploadCompanyPicture}
        id="imageUpload"
        ref={fileInputRef}
      />
      <label htmlFor="imageUpload">
        <Button
          className="flex-none px-12 translate-x-12 w-26 "
          type="button"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          Subir foto
        </Button>
      </label>
    </div>
  );
};

export default CompanyPictureButtons;
