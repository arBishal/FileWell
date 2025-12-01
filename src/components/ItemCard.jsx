import { useRef, useEffect } from "react";

import useFolderStore from "../store/useFolderStore";

import Popover from "./Popover";

export default function FolderCard({ id, item, type }) {
  const popoverRef = useRef(null);
  const cardRef = useRef(null);
  const {
    setParentId,
    selectedItemId,
    setSelectedItemId,
    moveitemIntoFolder,
    openPopoverId,
    setOpenPopoverId,
  } = useFolderStore();
  const isSelected = selectedItemId === id;
  const showPopover = openPopoverId === id;

  const handleSingleClick = () => {
    setSelectedItemId(id);
  };

  const handleDoubleClick = () => {
    if (type === "folder") {
      setParentId(id);
    }
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setSelectedItemId(id);
    setOpenPopoverId(openPopoverId === id ? null : id);
  };

  const handleDrop = (draggedItemId, targetFolderId, draggedItemType) => {
    if (draggedItemId === targetFolderId) {
      return;
    }
    moveitemIntoFolder(draggedItemId, targetFolderId, draggedItemType);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideCard = cardRef.current && cardRef.current.contains(event.target);
      const clickedInsidePopover = popoverRef.current && popoverRef.current.contains(event.target);
      if (!clickedInsidePopover && !clickedInsideCard) {
        setOpenPopoverId(null);
        setSelectedItemId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenPopoverId, setSelectedItemId]);

  return (
    <div
      key={id}
      ref={cardRef}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({ id, type })
        );
      }}
      onDragOver={(e) => {
        if (type === "folder") {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        if (type === "folder") {
          const data = JSON.parse(e.dataTransfer.getData("application/json"));
          handleDrop(data.id, id, data.type);
        }
      }}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      className={`min-h-12 w-full flex items-center justify-between gap-4 rounded-lg cursor-pointer pl-4 pr-3 ${
        isSelected ? "bg-neutral-700" : "hover:bg-neutral-800"
      }`}
    >
      {/* left elements */}
      <div className="flex items-center gap-4 w-9/12">
        <div id="item-icon" className="w-fit h-fit">
          {type === "folder" ? (
            <div className="relative h-6 w-8">
              <span className="absolute bottom-0 left-0 h-6 w-6 bg-neutral-500 rounded-xs"></span>
              <span className="absolute bottom-0 left-0 h-5 w-8 bg-neutral-400 rounded-xs"></span>
            </div>
          ) : (
            <div className="relative h-6 w-8">
              <span className="absolute bottom-0 left-0 h-6 w-5 bg-neutral-500 rounded-xs"></span>
              <span className="absolute bottom-0 left-1 h-6 w-5 bg-neutral-400 rounded-xs"></span>
              <span className="absolute top-0 left-2 text-neutral-300">f</span>
            </div>
          )}
        </div>

        <span id="item-label" className="text-sm truncate">
          {item.name}
        </span>
      </div>

      {/* right elements */}
      <div className="h-full relative">
        <button
          id="item-option"
          type="button"
          aria-label="item options"
          onClick={handleOptionsClick}
          onDoubleClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className={`flex items-center text-lg text-center h-full px-2  rounded-sm cursor-pointer ${
            isSelected ? "hover:bg-neutral-600/50" : "hover:bg-neutral-700/50"
          }`}
        >
          ⁝
        </button>

        {/* trigger popover */}
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          className={`absolute left-1/2 -translate-x-1/2 z-1 transition-all duration-200 ease-out ${showPopover ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-50 pointer-events-none'}`}
          style={{
            transform: showPopover ? 'translate(-50%, 0) scale(1)' : 'translate(-50%, 0) scale(0.5)',
          }}
        >
          {showPopover && (
            <Popover
              id={id}
              type={type}
              closePopover={() => setOpenPopoverId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
