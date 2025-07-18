import { useState } from "react";
import { PlusIcon } from "./Icons";

const AddFolderForm: React.FC<{ onAddFolder: (name: string) => void }> = ({
  onAddFolder,
}) => {
  const [name, setName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddFolder(name.trim());
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-2 mt-4">
      <label
        htmlFor="folder-name"
        className="text-xs text-gray-400 font-semibold"
      >
        Create New Folder
      </label>
      <div className="flex items-center gap-2 mt-1">
        <input
          id="folder-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Tech News"
          required
          className="w-full bg-zinc-700/50 border border-zinc-600 rounded-md px-2 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
        />
        <button
          type="submit"
          className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default AddFolderForm;
