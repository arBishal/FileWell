import useFolderStore from "../store/useFolderStore";

export default function Breadcrumbs() {
    const { parentId, setParentId, folders } = useFolderStore();
    const path = [];
    let tempId = parentId;

    while (tempId !== "0" && folders[tempId]) {
        path.push(folders[tempId]);
        tempId = folders[tempId].parent;
    }

    path.push({ id: "0", name: "root" });
    path.reverse();

    return (
        <div id="breadcrumbs" className="w-full bg-neutral-900 rounded-t-2xl sm:rounded-tl-2xl sm:rounded-tr-none px-6 py-3 border-b border-neutral-700">
            {path.map((folder, index) => (
                <div key={folder.id} className="inline-flex items-center gap-2">
                    {index !== 0 && <span>/</span>}
                    <button
                        type="button"
                        className="cursor-pointer hover:text-white text-left"
                        onClick={() => setParentId(folder.id)}
                    >
                        {folder.name}
                    </button>
                </div>
            ))}
        </div>
    );
}

// append whitespace after folder name