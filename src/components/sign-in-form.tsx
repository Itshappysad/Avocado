import Input from './input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { singin } from '../core/auth';
import { useNavigate } from 'react-router-dom';
import { SinginUser, singUserSchema } from '../schemas/singin';
import GoogleSignIn from './google-sign-in';
import { toast } from 'sonner';

function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SinginUser>({
    resolver: zodResolver(singUserSchema),
  });

  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit(async ({ email, password }) => {
        const user = await singin(email, password);
        if (!user) return toast.error('Usuario o contrasela incorrectos');
        navigate('/', { replace: true });
      })}
      className='flex flex-col px-10'
    >
      <div className='flex flex-col gap-4'>
        <Input
          {...register('email')}
          placeholder='Correo'
          error={errors.email}
        />
        <Input
          className='grow'
          {...register('password')}
          placeholder='Contraseña'
          error={errors.password}
          type='password'
        />
      </div>
      <div className='flex justify-center mt-8'>
        <button
          className='
            py-2 px-3 bg-gray-800 font-bold rounded-xl text-white transition-transform
            hover:bg-gray-400
            active:scale-95
            disabled:bg-lime-900
          '
          disabled={isSubmitting}
        >
          Inicio Sesión
        </button>
      </div>
      <div className='grid place-content-center mt-3'>
        <GoogleSignIn />
      </div>
    </form>
  );
}
export default SignInForm;
