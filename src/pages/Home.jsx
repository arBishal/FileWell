import { useRef } from "react";

import useFolderStore from "../store/useFolderStore";

import Breadcrumbs from "../components/Breadcrumbs";
import ActionButtons from "../components/ActionButtons";
import Folders from "../components/Folders";
import Files from "../components/Files";

export default function Home() {
  const { parentId, setParentId, folders, createFolder, addFileToFolder } =
    useFolderStore();
  const fileInputRef = useRef(null);
  const defaultFolderName = "meow folder";

  const handleFolderCreation = () => {
    const folderName = prompt("enter folder name:", defaultFolderName);
    if (folderName) {
      createFolder(parentId, folderName);
      console.log("folder created:", folderName);
      return;
    } else {
      console.log("no name provided");
      return;
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        addFileToFolder(parentId, {
          name: file.name,
          type: file.type,
          size: file.size,
          result: reader.result,
        });
        console.log("file uploaded:", file.name);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="h-full w-full flex flex-col flex-grow">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <Breadcrumbs />
        <ActionButtons
          handleFolderCreation={handleFolderCreation}
          handleUploadClick={handleUploadClick}
        />
        <input
          type="file"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
      <div className="bg-neutral-900 rounded-b-2xl p-6 w-full h-full flex flex-col gap-1">
        <h2 className="font-bold text-lg"> folders </h2>
        <Folders />
        <hr className="border-neutral-800 my-6" />
        <h2 className="font-bold text-lg"> files </h2>
        <Files />
      </div>
    </div>
  );
}
