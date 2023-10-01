import Axios from "axios";
import { useState } from "react";
import Image from "next/image";

const Upload = () => {
    const [imageSelected, setImageSelected] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Set the selected image as a data URL
            setImageSelected(reader.result as string);
        };
        reader.readAsDataURL(file);
        }
    };

    const uploadImage = () => {
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "ml_default");

        Axios.post("https://api.cloudinary.com/v1_1/dbrsvtcm0/image/upload", formData).then((response) => {
        console.log(response);
        });
    };

    return (
    <div>
        <input type="file" onChange={handleFileChange} />
        {imageSelected && <Image src={imageSelected} alt="Selected" width={600} height={600}/>}
        <button onClick={uploadImage} disabled={!imageSelected}>
            Upload Image
        </button>
    </div>
    );
};

export default Upload;