import { create } from "zustand";

const getInitialFolders = () => {
  const storedFolders = localStorage.getItem("folders");
  if (storedFolders) {
    return JSON.parse(storedFolders);
  }

  return {
    "0": {
      id: "0",
      name: "root",
      parent: null,
      children: [],
      files: [],
    },
  };
};

const generateUniqueId = () => crypto.randomUUID();

const useFolderStore = create((set) => ({
  // initial state
  parentId: "0",
  folders: getInitialFolders(),
  selectedItemId: null,

  // setters
  setParentId: (id) => set({ parentId: id }),
  setFolders: (updater) =>
    set((state) => {
      const nextFolders =
        typeof updater === "function" ? updater(state.folders) : updater;

      localStorage.setItem("folders", JSON.stringify(nextFolders));
      return { folders: nextFolders };
    }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),

  // actions
  createFolder: (parentId, folderName) =>
    set((state) => {
      const id = generateUniqueId();
      const newFolder = {
        id: id,
        name: folderName,
        parent: parentId,
        children: [],
        files: [],
      };

      const updatedParent = {
        ...state.folders[parentId],
        children: [...state.folders[parentId].children, id],
      };

      const updatedFolders = {
        ...state.folders,
        [id]: newFolder,
        [parentId]: updatedParent,
      };

      localStorage.setItem("folders", JSON.stringify(updatedFolders));
      return { folders: updatedFolders };
    }),

  renameFolder: (id, newName) =>
    set((state) => {
      const updated = {
        ...state.folders,
        [id]: { ...state.folders[id], name: newName },
      };
      localStorage.setItem("folders", JSON.stringify(updated));
      return { folders: updated };
    }),

  removeFolder: (id) =>
    set((state) => {
      const updated = { ...state.folders };

      const parentId = updated[id].parent;
      if (parentId != null && updated[parentId]) {
        updated[parentId].children = updated[parentId].children.filter(
          (childId) => childId !== id
        );
      }

      delete updated[id];

      localStorage.setItem("folders", JSON.stringify(updated));
      return { folders: updated };
    }),

  addFileToFolder: (folderId, file) =>
    set((state) => {
    const fileObject = {
      id: generateUniqueId(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: file.result,
      timestamp: Date.now(),
    };
    const updatedFolder = {
      ...state.folders[folderId],
      files: [...(state.folders[folderId].files || []), fileObject],
    };

    const updatedFolders = {
      ...state.folders,
      [folderId]: updatedFolder,
    };

    localStorage.setItem("folders", JSON.stringify(updatedFolders));
    return { folders: updatedFolders };
  }),

  moveitemIntoFolder: (draggedItemId, targetFolderId, type) =>
    set((state) => {
      const folders = {...state.folders};

      // ensuring the target folder exists
      if (!(targetFolderId in folders)) {
        return;
      }

      if(type === "folder") {
        const draggedFoldder = folders[draggedItemId];
        if (draggedFoldder == null || draggedItemId === targetFolderId) {
          return {};
        }

        const currentParentId = draggedFoldder.parent;
        if (currentParentId != null && folders[currentParentId]) {
          folders[currentParentId].children = folders[currentParentId].children.filter(
            (childId) => childId !== draggedItemId
          );
        }

        folders[draggedItemId].parent = targetFolderId;
        folders[targetFolderId].children.push(draggedItemId);
      }
      else if(type === "file") {
        let parentFolderId = null;
        for(const [folderId, folder] of Object.entries(folders)) {
          if(folder.files?.some((file) => file.id === draggedItemId)) {
            parentFolderId = folderId;
            break;
          }
        }

        if (parentFolderId == null) {
          return {};
        }

        const draggedFile = folders[parentFolderId].files.find(
          (file) => file.id === draggedItemId
        );
        
        if (draggedFile == null) {
          return {};
        }

        folders[parentFolderId].files = folders[parentFolderId].files.filter(
          (file) => file.id !== draggedItemId
        );
        folders[targetFolderId].files.push(draggedFile);
      }
      
      localStorage.setItem("folders", JSON.stringify(folders));
      return { folders };
    })

}));

export default useFolderStore;
