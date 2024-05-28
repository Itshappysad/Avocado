import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const paymentSchema = z.object({
  email: z
    .string()
    .email({ message: "Ingresa un correo valido" })
    .min(1, { message: "Campo requerido" }),
  nombre: z.string().min(1, { message: "Campo requerido" }),
  apellidos: z.string().min(1, { message: "Campo requerido" }),
  direccion: z.string().min(1, { message: "Campo requerido" }),
  detalles_direccion: z.string().optional(),
  departamento: z.string().min(1, { message: "Campo requerido" }),
  cedula: z.string().min(1, { message: "Campo requerido" }),
  telefono: z.string().min(1, { message: "Campo requerido" }),
  pais: z.string().min(1, { message: "Campo requerido" }),
  ciudad: z.string().min(1, { message: "Campo requerido" }),
  codigo_postal: z.string().min(1, { message: "Campo requerido" }),
});

type Payment = z.infer<typeof paymentSchema>;

const FormPayment = (props: {
  handlePay: (formData: any) => Promise<{
    success: boolean;
  }>;
}) => {
  const { handlePay } = props;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Payment>({
    resolver: zodResolver(paymentSchema),
  });

  const submit: SubmitHandler<Payment> = async (formData) => {
    try {
      const toastId = toast.loading("Realizando compra...");

      const result = await handlePay(formData);

      if (!result.success) {
        return toast.error("Ha ocurrido un error", {
          id: toastId,
        });
      }

      toast.success("Compra realizada exitosamente");
      navigate("/account/history");
      console.log("Payment Result:", result);
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex gap-10 flex-column">
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-start">Contacto</h2>
          <div className="text-start">
            <label className="block text-sm">Correo electrónico</label>
            <input
              {...register("email")}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
            {errors.email && (
              <small className="text-red-600 text-[12px] font-bold">
                {errors.email.message}
              </small>
            )}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-start">Entrega</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-start">País / Región</label>
              <select
                {...register("pais")}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              >
                <option value="Colombia">Colombia</option>
              </select>
              {errors.pais && (
                <small className="text-red-600 text-[12px] font-bold">
                  {errors.pais.message}
                </small>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-start">
                <label className="block text-sm text-start">Nombre</label>
                <input
                  {...register("nombre")}
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                />
                {errors.nombre && (
                  <small className="text-red-600 text-[12px] font-bold">
                    {errors.nombre.message}
                  </small>
                )}
              </div>
              <div className="text-start">
                <label className="block text-sm text-start">Apellidos</label>
                <input
                  {...register("apellidos")}
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                />
                {errors.apellidos && (
                  <small className="text-red-600 text-[12px] font-bold">
                    {errors.apellidos.message}
                  </small>
                )}
              </div>
            </div>
            <div className="text-start">
              <label className="block text-sm text-start">
                Número de cédula
              </label>
              <input
                {...register("cedula")}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.cedula && (
                <small className="text-red-600 text-[12px] font-bold">
                  {errors.cedula.message}
                </small>
              )}
            </div>
            <div className="text-start">
              <label className="block text-sm text-start">Dirección</label>
              <input
                {...register("direccion")}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.direccion && (
                <small className="text-red-600 text-[12px] font-bold">
                  {errors.direccion.message}
                </small>
              )}
            </div>
            <div className="text-start">
              <label className="block text-sm text-start">
                Detalles dirección (Opcional)
              </label>
              <input
                {...register("detalles_direccion")}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.detalles_direccion && (
                <small className="text-red-600 text-[12px] font-bold">
                  {errors.detalles_direccion.message}
                </small>
              )}
            </div>
            <div className="row">
              <div className="col-4 text-start">
                <label className="block text-sm text-start">Ciudad</label>
                <input
                  {...register("ciudad")}
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                />
                {errors.ciudad && (
                  <small className="text-red-600 text-[12px] font-bold">
                    {errors.ciudad.message}
                  </small>
                )}
              </div>
              <div className="col-4 text-start">
                <label className="block text-sm text-start">Departamento</label>
                <input
                  {...register("departamento")}
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                />
                {errors.departamento && (
                  <small className="text-red-600 text-[12px] font-bold">
                    {errors.departamento.message}
                  </small>
                )}
              </div>
              <div className="col-4 text-start">
                <label className="block text-sm text-start">
                  Código postal
                </label>
                <input
                  {...register("codigo_postal")}
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                />
                {errors.codigo_postal && (
                  <small className="text-red-600 text-[12px] font-bold">
                    {errors.codigo_postal.message}
                  </small>
                )}
              </div>
            </div>
            <div className="text-start">
              <label className="block text-sm text-start">Teléfono</label>
              <input
                {...register("telefono")}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
              {errors.telefono && (
                <small className="text-red-600 text-[12px] font-bold">
                  {errors.telefono.message}
                </small>
              )}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-start">Métodos de envío</h2>
          <div>
            <label className="block text-sm text-start">
              Envío en Colombia
            </label>
            <div className=" bg-gray-200 flex items-center justify-between mt-2 p-2 border border-black rounded">
              <span>Envío en Colombia</span>
              <span>$ 12.500,00</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <button
            disabled={isSubmitting}
            className="w-full bg-black text-white h-[5vh] font-bold rounded"
          >
            Realizar pedido
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormPayment;
