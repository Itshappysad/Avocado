import useProfilePicture from "../hooks/useProfilePicture";
import LoadingIcon from "./icons/loading";

type Props = {
  id: string;
};

const ProfilePicture = ({ id }: Props) => {
  const { imageUrl, isLoading } = useProfilePicture(id);

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
            className="size-64 border rounded-full shadow-sm object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
