import useCompanyPicture from "../hooks/useCompanyPicture";
import LoadingIcon from "./icons/loading";

type Props = {
  id: string;
};

const CompanyPicture = ({ id }: Props) => {
  const { imageUrl, isLoading } = useCompanyPicture(id);

  return (
    <div>
      <div className="flex flex-row gap-x-10 gap-y-16 py-10">
        {isLoading ? (
          <div className="size-64 grid place-content-center">
            <LoadingIcon className="text-5xl" />
          </div>
        ) : (
          <img
            src={imageUrl || "imgs/AeVlogo.jpeg"}
            alt="pfp"
            className="size-64 border rounded-md shadow-sm object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default CompanyPicture;
