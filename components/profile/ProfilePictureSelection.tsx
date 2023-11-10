import Image from "next/image";

interface ProfilePictureSelectionProps {
  selectedPicture: string; 
  onSelectPicture: (picture: string) => void;
}

const ProfilePictureSelection: React.FC<ProfilePictureSelectionProps>  = ({ selectedPicture, onSelectPicture }) => {
  const pictureOptions = Array.from({ length: 45 }, (_, index) => index + 1);

  return (
    <div className="bg-white">
      <br></br>
      <h3>Select Your Profile Avatar</h3>
      <br></br>
      <div className="profile-picture-options">
        {pictureOptions.map((option) => (
          <button
            key={option}
            className={`profile-picture-thumbnail ${
              selectedPicture === option.toString() ? "selected" : ""
            }`}
            onClick={() => onSelectPicture(option.toString())}
          >
            <Image
              src={`/profile-pictures/${option}.png`}
              alt={`Option ${option}`}
              width={100}
              height={100}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePictureSelection;