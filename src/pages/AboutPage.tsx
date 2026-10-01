/**
 * Sobre nosotros (ruta "/about"): historia, misión, visión, valores y equipo.
 */
import { BadgeCheck, UserRound } from "lucide-react";
import { PageHeader } from "../components/ui/page-header";

/** Tarjetas de texto de la página (título y párrafo). */
const sections = [
  {
    title: "¿Quiénes somos?",
    text: "Avocado e Vestiti es un grupo de programadores que se unieron para renovar las compras en el mundo de la moda a través de la programación, haciendo que hoy en día comprar ropa en línea sea muy fácil para nuestros clientes.",
  },
  {
    title: "Nuestra visión",
    text: "Ser una de las compañías líderes en la industria de la moda, ofreciendo prendas de calidad y accesibles a precios atractivos, y brindando a nuestros clientes una opción más sostenible.",
  },
  {
    title: "Nuestra misión",
    text: "Enriquecer la vida de los consumidores con una experiencia de compra nueva, actual y conveniente, que contribuya a su desarrollo personal.",
  },
  {
    title: "Historia",
    text: "Avocado e Vestiti empezó como una idea de tres adolescentes jugando. Con el paso del tiempo esa idea maduró hasta convertirse en las ganas de emprender: recién salidos de grado 10, empezaron a programar e idear cómo sería la empresa que es hoy.",
  },
];

/** Valores de la empresa. */
const values = [
  "Responsabilidad social",
  "Honestidad",
  "Creatividad",
  "Calidad",
];

/** Integrantes del equipo. */
const team = ["Andrés Martínez Martínez"];

/** Tarjeta blanca con título. */
function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="text-neutral-600">{children}</div>
    </article>
  );
}

/** Página "Sobre nosotros". Los textos están en las constantes de arriba. */
export default function AboutPage() {
  return (
    <>
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <img
          src="/imgs/AeVlogo.jpeg"
          alt="Logo de Avocado e Vestiti"
          className="size-32 rounded-full object-cover shadow"
        />
        <PageHeader
          title="Sobre nosotros"
          description="Conoce la historia y el equipo detrás de Avocado e Vestiti"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((s) => (
          <InfoCard key={s.title} title={s.title}>
            <p>{s.text}</p>
          </InfoCard>
        ))}

        <InfoCard title="Valores">
          <ul className="space-y-2">
            {values.map((v) => (
              <li key={v} className="flex items-center gap-2">
                <BadgeCheck className="size-5 text-brand-600" />
                {v}
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard title="Equipo">
          <ul className="space-y-2">
            {team.map((member) => (
              <li key={member} className="flex items-center gap-2">
                <UserRound className="size-5 text-brand-600" />
                {member}
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>
    </>
  );
}
