import type { Note } from "../types/note"
import DeleteIcon from "@mui/icons-material/DeleteOutline";

function NotesList({ list, onNoteClick, handleRemove }: { list: Note[], onNoteClick: (note: Note) => void, handleRemove: (id: string) => void }) {
    return (
        <div className="flex gap-2 flex-col">
            {list.map((note) => (
                <div
                    className="border-[#D9D9D9] border shadow-md flex w-full p-4 rounded-xl justify-between cursor-pointer"
                    key={note._id}  
                    onClick={() => onNoteClick(note)}
                >
                    <h3 className="text-md font-semibold">{note.title}</h3>
                    <DeleteIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleRemove(note._id);
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

export default NotesList;
