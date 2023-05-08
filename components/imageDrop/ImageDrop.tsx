// import { useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { uploadMiddleware, uploadFile } from "../lib/api";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const Dropzone = () => {
//   const [file, setFile] = useState<Express.Multer.File | null>(null);

//   const handleDrop = async (acceptedFiles: File[]) => {
//     uploadMiddleware(acceptedFiles[0], null, async (error) => {
//       if (error) {
//         console.log(error);
//         return;
//       }
//       const uploadedFile = await uploadFile(acceptedFiles[0]);
//       const savedFile = await prisma.file.create({
//         data: {
//           name: uploadedFile.name,
//           url: uploadedFile.url,
//         },
//       });
//       setFile(savedFile);
//     });
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

//   return (
//     <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
//       <input {...getInputProps()} />
//       {file ? <img src={file.url} alt={file.name} /> : <p>Drag and drop your picture here</p>}
//     </div>
//   );
// };

// export default Dropzone;