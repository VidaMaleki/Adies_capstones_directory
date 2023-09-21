import Image from "next/image";
import { useState } from "react";

interface ProfilePictureSelectionProps {
  selectedPicture: string; 
  onSelectPicture: (picture: string) => void;
}

const ProfilePictureSelection: React.FC<ProfilePictureSelectionProps>  = ({ selectedPicture, onSelectPicture }) => {
  const pictureOptions = [...Array(45).keys()];

  return (
    <div>
      <h3>Select Your Profile Picture</h3>
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
              width={100} // Adjust width and height as needed
              height={100}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePictureSelection;