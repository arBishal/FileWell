import useFolderStore from "../store/useFolderStore";

export default function Popover({ id, type, closePopover }) {
  const { folders, setFolders, parentId } = useFolderStore();

  const handleRename = () => {
    const newName = prompt("enter meow name!");
    if (!newName?.trim()) {
      return;
    }
    setFolders((prev) => {
      const updated = { ...prev };

      if (type === "folder") {
        updated[id].name = newName;
      } else if (type === "file") {
        const parent = updated[parentId];
        parent.files = parent.files.map((file) =>
          file.id === id ? { ...file, name: newName } : file
        );
      }

      return updated;
    });

    console.log("item renamed");

    closePopover();
  };

  const handleRemove = () => {
    setFolders((prev) => {
      const updated = { ...prev };

      if (type === "folder") {
        const parent = updated[id].parent;
        if (updated[parent]) {
          updated[parent].children = updated[parent].children.filter(
            (childId) => childId !== id
          );
        }
        delete updated[id];
      } else if (type === "file") {
        updated[parentId].files = updated[parentId].files.filter(
          (file) => file.id !== id
        );
      }

      console.log("item removed");

      return updated;
    });

    closePopover();
  };

  return (
    <div className="flex flex-col z-20" role="menu">
      <button
        type="button"
        onClick={handleRename}
        className="px-4 py-2 rounded-t text-left bg-neutral-950 hover:bg-neutral-700"
      >
        Rename
      </button>
      <hr className="border-[1px] border-neutral-800" />
      <button
        type="button"
        onClick={handleRemove}
        className="px-4 py-2 rounded-b text-left bg-neutral-950 hover:bg-neutral-700"
      >
        Remove
      </button>
    </div>
  );
}

// the tricolon hovers before the popover