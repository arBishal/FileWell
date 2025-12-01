import { create } from "zustand";
import { persist } from "zustand/middleware";

const generateUniqueId = () => crypto.randomUUID();

const getInitialFolders = () => ({
  "0": {
    id: "0",
    name: "root",
    parent: null,
    children: [],
    files: [],
  },
});

const useFolderStore = create(
  persist(
    (set, get) => ({
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

          return { folders: updatedFolders };
        }),

      renameFolder: (id, newName) =>
        set((state) => {
          const updated = {
            ...state.folders,
            [id]: { ...state.folders[id], name: newName },
          };
          return { folders: updated };
        }),

      removeFolder: (id) =>
        set((state) => {
          const updated = { ...state.folders };

          // recursively collect descendants for deletion
          const collectDescendants = (folderId, out = []) => {
            out.push(folderId);
            const children = updated[folderId]?.children || [];
            for (const childId of children) {
              collectDescendants(childId, out);
            }
            return out;
          };

          const toDelete = collectDescendants(id, []);

          // remove references from parent
          const parentId = updated[id].parent;
          if (parentId != null && updated[parentId]) {
            updated[parentId].children = updated[parentId].children.filter(
              (childId) => childId !== id
            );
          }

          // delete all collected ids
          for (const delId of toDelete) {
            delete updated[delId];
          }

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

          return { folders: updatedFolders };
        }),

      moveitemIntoFolder: (draggedItemId, targetFolderId, type) =>
        set((state) => {
          const folders = { ...state.folders };

          // ensure the target folder exists
          if (!(targetFolderId in folders)) {
            return {};
          }

          if (type === "folder") {
            const draggedFoldder = folders[draggedItemId];
            if (draggedFoldder == null || draggedItemId === targetFolderId) {
              return {};
            }

            // prevent moving a folder into its own descendant
            const isDescendant = (candidateId, possibleAncestorId) => {
              if (candidateId === possibleAncestorId) return true;
              const children = folders[possibleAncestorId]?.children || [];
              for (const child of children) {
                if (isDescendant(candidateId, child)) return true;
              }
              return false;
            };

            if (isDescendant(targetFolderId, draggedItemId)) {
              // can't move into its own descendant
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
          } else if (type === "file") {
            let parentFolderId = null;
            for (const [folderId, folder] of Object.entries(folders)) {
              if (folder.files?.some((file) => file.id === draggedItemId)) {
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

          return { folders };
        }),
    }),
    {
      name: "filewell-storage",
      partialize: (state) => ({ parentId: state.parentId, folders: state.folders }),
    }
  )
);

export default useFolderStore;
