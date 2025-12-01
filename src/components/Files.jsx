import ItemCard from "./ItemCard";
import useFolderStore from "../store/useFolderStore";

export default function Files() {
  const { folders, parentId } = useFolderStore();
  const currentFolder = folders[parentId];
  return (
    <div id="folder-collection" className="w-full flex-grow">
      {currentFolder?.files?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {currentFolder.files.map((file) => (
            <ItemCard key={file.id} id={file.id} item={file} type={"file"} />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-500 mt-4">
          no files here. try uploading one!
        </p>
      )}
    </div>
  );
}
