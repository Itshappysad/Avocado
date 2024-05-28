import { ChangeEvent, useRef, useState } from "react";
import { Button } from "./ui/button";

type Props = {
  onImageSet: (image: File) => void;
  defaultImage?: string;
};

const ItemPicture = ({ onImageSet, defaultImage }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];

    const fileUrl = URL.createObjectURL(file);
    onImageSet(file);
    setImageUrl(fileUrl);
  };

  return (
    <div>
      <div className="flex flex-row gap-x-10 gap-y-16 py-10">
        <input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={onFileSelect}
          accept="image/*"
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="pfp"
            className="size-64 border rounded-md shadow-sm object-cover"
          />
        ) : defaultImage ? (
          <img
            src={defaultImage}
            alt="pfp"
            className="size-64 border rounded-md shadow-sm object-cover"
          />
        ) : (
          "Selecciona una imagen"
        )}
        <Button onClick={() => inputRef.current?.click()} type="button">
          Seleccionar
        </Button>
      </div>
    </div>
  );
};

export default ItemPicture;
