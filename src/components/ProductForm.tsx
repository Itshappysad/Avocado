/**
 * Formulario para publicar o editar un producto de la empresa.
 */
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CATEGORY_OPTIONS,
  MATERIAL_OPTIONS,
  SIZE_OPTIONS,
} from "../core/constants";
import { createProduct, updateProduct } from "../core/database";
import { imagePaths } from "../core/storage";
import type { Product } from "../core/types";
import { productFormSchema, type ProductFormValues } from "../schemas/product";
import { useStorageImage } from "../hooks/useStorageImage";
import { ImagePicker } from "./ImagePicker";
import { MultiColorPicker } from "./MultiColorPicker";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { NativeSelect } from "./ui/native-select";

type ProductFormProps = {
  /** Empresa a la que pertenece el producto. */
  companyId: string;
  /** Si se pasa un producto, el formulario funciona en modo edición. */
  product?: Product;
  /** Se llama después de guardar correctamente. */
  onSaved?: () => void;
};

/** Convierte ["S", "M"] en opciones { label, value } para el Combobox. */
const toOptions = (values: string[]) =>
  values.map((v) => ({ label: v, value: v }));

/**
 * Formulario para crear o editar un producto de la empresa.
 *
 * - Valida con `productFormSchema` y muestra los errores debajo de cada campo.
 * - Tallas, categorías y colores son controles propios conectados con
 *   <Controller> de react-hook-form.
 * - La imagen es obligatoria al crear y opcional al editar.
 * - Al guardar invalida la caché de ["products"] para que las listas se
 *   actualicen solas.
 *
 * @example
 * <ProductForm companyId={company.id} />                  // crear
 * <ProductForm companyId={company.id} product={product} /> // editar
 */
export function ProductForm({ companyId, product, onSaved }: ProductFormProps) {
  const isEditing = !!product;
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const { url: currentImage } = useStorageImage(
    product ? imagePaths.product(product.id) : null,
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price,
      materials: product?.materials ?? "",
      sizes: product?.sizes ?? [],
      categories: product?.categories ?? [],
      colors: product?.colors ?? [],
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!isEditing && !image) {
      setImageError("Selecciona una imagen");
      return;
    }

    try {
      if (isEditing) {
        await updateProduct(product.id, values, image);
        if (image) {
          await queryClient.invalidateQueries({
            queryKey: ["storage-image", imagePaths.product(product.id)],
          });
        }
        toast.success("Producto actualizado");
      } else {
        await createProduct(companyId, values, image!);
        toast.success("Producto creado");
        reset();
        setImage(null);
      }
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      onSaved?.();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar el producto");
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-8 md:grid-cols-[1fr_240px]"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nombre del producto"
          htmlFor="name"
          error={errors.name?.message}
          className="sm:col-span-2"
        >
          <Input id="name" invalid={!!errors.name} {...register("name")} />
        </Field>

        <Field
          label="Precio (COP)"
          htmlFor="price"
          error={errors.price?.message}
        >
          <Input
            id="price"
            type="number"
            min={1}
            inputMode="numeric"
            invalid={!!errors.price}
            {...register("price")}
          />
        </Field>

        <Field
          label="Material"
          htmlFor="materials"
          error={errors.materials?.message}
        >
          <NativeSelect
            id="materials"
            invalid={!!errors.materials}
            {...register("materials")}
          >
            <option value="">Elegir...</option>
            {MATERIAL_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Tallas" htmlFor="sizes" error={errors.sizes?.message}>
          <Controller
            control={control}
            name="sizes"
            render={({ field }) => (
              <Combobox
                id="sizes"
                options={toOptions(SIZE_OPTIONS)}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona las tallas"
                invalid={!!errors.sizes}
              />
            )}
          />
        </Field>

        <Field
          label="Categorías"
          htmlFor="categories"
          error={errors.categories?.message}
        >
          <Controller
            control={control}
            name="categories"
            render={({ field }) => (
              <Combobox
                id="categories"
                options={CATEGORY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecciona el tipo de prenda"
                invalid={!!errors.categories}
              />
            )}
          />
        </Field>

        <Field
          label="Colores"
          error={errors.colors?.message}
          className="sm:col-span-2"
        >
          <Controller
            control={control}
            name="colors"
            render={({ field }) => (
              <MultiColorPicker value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="sm:col-span-2 sm:justify-self-start"
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Publicar producto"}
        </Button>
      </div>

      <Field
        label="Imagen"
        error={imageError ?? undefined}
        className="order-first md:order-none"
      >
        <ImagePicker
          defaultImage={currentImage}
          invalid={!!imageError}
          onChange={(file) => {
            setImage(file);
            setImageError(null);
          }}
        />
      </Field>
    </form>
  );
}
