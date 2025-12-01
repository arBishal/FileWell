export default function Breadcrumbs({currentFolder, setCurrentFolder, folders}) {
    const path = [];
    let tempId = currentFolder;

    while(tempId !== "0" && folders[tempId]) {
        path.push(folders[tempId]);
        tempId = folders[tempId].parent;
    }

    path.push({id: "0", name: "root"});
    path.reverse();

  return (
    <div id="breadcrumbs" className="w-full bg-neutral-900 rounded-t-2xl sm:rounded-tl-2xl sm:rounded-tr-none px-6 py-3 border-b border-neutral-700">
        {path.map((folder, index) => (
            <div key={folder.id} className="inline-flex items-center gap-2">
                {index !== 0 && <span>/</span>}
                <span className="cursor-pointer hover:text-white" onClick={() => setCurrentFolder(folder.id)}>
                    {folder.name}
                </span>
            </div>
        ))}
    </div>
  );
}   

// append whitespace after folder name
// refactor to reduce prop and use store