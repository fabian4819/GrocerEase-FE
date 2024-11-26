// components/FileUploadButton.tsx
import React from "react";
import DefaultButton from "./defaultButton";

interface FileUploadButtonProps {
  children: React.ReactNode;
  onFileSelect: (file: File) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  children,
  onFileSelect,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]); // Extract the file and pass it
    }
  };

  return (
    <div className="flex-1">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {/* Button to trigger the file input */}
      <DefaultButton
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {children}
      </DefaultButton>
    </div>
  );
};

export default FileUploadButton;
