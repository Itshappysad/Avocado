import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Button } from "../components/ui/button";
import Input from "../components/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductForCompany } from "../core/database";
import { toast } from "sonner";
import {
  RegisterProduct,
  RegisterProductForm,
  registerProductFormSchema,
} from "../schemas/product";
import ItemPicture from "./ItemPic";
import { Combobox } from "./ui/combobox";
import { Company } from "../core/types";
import MultiColorPicker from "./multi-color-picker";
import { rgbToHex } from "../core/utils";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const categoryOptions = ["Camisa", "Pantalon"];

type Props = {
  company: Company;
};

function EditItemForm({ company }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sizes, setSizes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [colors, setColors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterProductForm>({
    resolver: zodResolver(registerProductFormSchema),
  });

  useEffect(() => {
    if (!user) {
      navigate("/signUp");
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<RegisterProductForm> = async (data) => {
    const toastId = toast.loading("Cargando...");

    if (!user) {
      return toast.error("Usuario no encontrado", { id: toastId });
    }

    if (sizes.length === 0) {
      return toast.error("Debe seleccionar al menos un tamaño", {
        id: toastId,
      });
    }

    if (categories.length === 0) {
      return toast.error("Debe seleccionar al menos una categoría", {
        id: toastId,
      });
    }

    if (colors.length === 0) {
      return toast.error("Debe seleccionar al menos un color", {
        id: toastId,
      });
    }

    if (!image) {
      return toast.error("Debe seleccionar una imagen", { id: toastId });
    }

    const productData: RegisterProduct = {
      ...data,
      sizes,
      categories,
      image,
      colors: colors.map((c) => {
        const rgb = c.split(", ").map((v) => +v);
        return rgbToHex(rgb[0], rgb[1], rgb[2]);
      }),
    };

    const success = await createProductForCompany({
      userId: user.id,
      companyId: company.id,
      productData,
    });

    if (success) {
      toast.success("Producto creado exitosamente!", { id: toastId });
    } else {
      toast.error("Error al crear el producto", { id: toastId });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-20 flex flex-col gap-1"
    >
      <div className="flex gap-6">
        <div className=" flex-col flex-wrap">
          <div>
            <label className="font-bold py-2" htmlFor="name">
              Nombre del producto:
            </label>
            <Input {...register("name")} />
          </div>
          <div>
            <label className="font-bold py-2" htmlFor="price">
              Precio:
            </label>
            <Input {...register("price", { valueAsNumber: true })} />
          </div>
          <div className="flex flex-row gap-1 w-full">
            <div className="w-[50%]">
              <label className="font-bold py-2 block" htmlFor="address">
                Color:
              </label>
              <MultiColorPicker onColorChange={(c) => setColors(c)} />
            </div>
            <div className="w-[50%]">
              <label className="font-bold py-2 " htmlFor="address">
                Tallas:
              </label>
              <Combobox
                onValueChange={(values) => setSizes(values)}
                label="unas tallas"
                options={sizeOptions.map((size) => ({
                  label: size,
                  value: size,
                }))}
              />
            </div>
          </div>

          <div className="flex flex-row gap-1 w-full">
            <div className="w-[50%]">
              <label className="font-bold py-2 block" htmlFor="address">
                Categoria de ropa:
              </label>
              <Combobox
                onValueChange={(values) => setCategories(values)}
                label="un tipo de prenda"
                options={categoryOptions.map((category) => ({
                  label: category,
                  value: category,
                }))}
              />
            </div>
            <div className="w-[50%]">
              <label className="font-bold py-2 block" htmlFor="address">
                Material:
              </label>
              <select
                {...register("materials")}
                className="border-1   border-gray-400 rounded-md w-full h-9 focus:border-blue-500 focus:border-4"
              >
                <option value="">Elegir...</option>
                <option value="algodon">Algodón</option>
                <option value="poliester">Poliéster</option>
                <option value="seda">Seda</option>
                <option value="lana">Lana</option>
              </select>
            </div>
          </div>

          <div className="py-4">
            <Button disabled={isSubmitting} className="px-60">
              Subir informacion
            </Button>
          </div>
        </div>
        <div className="flex flex-col  rounded-sm h-32 px-10">
          <ItemPicture onImageSet={(img) => setImage(img)} />
        </div>
      </div>
    </form>
  );
}

export default EditItemForm;
