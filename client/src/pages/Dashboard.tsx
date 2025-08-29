import Button from "@mui/material/Button"
import Top from "../assets/top.png"
import UserCard from "../Components/UserCard"
import { useAppContext } from "../Context/AppContext"
import { useEffect, useState } from "react"
import type { Note } from "../types/note"
import { DELETE, GET, POST, PUT } from "../api"
import { toast } from "react-toastify"
import NotesList from "../Components/NotesList"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material"
import { Bounce, ToastContainer } from "react-toastify";


function Dashboard() {
    const { logout } = useAppContext()
    const [notes, setNotes] = useState<Note[]>([])
    const [loadingNotes, setLoadingNotes] = useState<boolean>(false)
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isUpdate, setIsUpdate] = useState(false)
    const fetchNotes = async () => {
        try {
            setLoadingNotes(true)
            const notesRes = await GET<Note[]>("/notes/all")
            setNotes(notesRes)
        } catch (error) {
            toast.error("Failed to fetch notes")
        } finally {
            setLoadingNotes(false)
        }
    }

    const handleSave = async () => {
        const notify = toast.loading("Creating note...");

        try {
            await POST("/notes/create", { title, content })
            toast.update(notify, {
                render: "Note has been added successfully ✅",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            setOpen(false)
            setTitle("")
            setContent("")
            fetchNotes()
        } catch (error) {
            toast.update(notify, {
                render: "Failed to add note",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    }
    const handleUpdate = async () => {
        const notify = toast.loading("Updating note...");

        try {
            await PUT(`/notes/update/${selectedNote?._id}`, { title, content })
            toast.update(notify, {
                render: "Note has been updated successfully ✅",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            setTitle("")
            setContent("")
            await fetchNotes()
            setOpen(false)
        } catch (error) {
            toast.update(notify, {
                render: "Failed to update note",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
        }
    }
    const handleRemove = async (id: string) => {
        const notify = toast.loading("Deleting note...");

        try {
            await DELETE(`/notes/delete/${id}`)
            toast.update(notify, {
                render: "Note has been deleted successfully ✅",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            fetchNotes()
        } catch (error) {
            toast.update(notify, {
                render: "Failed to delete note",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [])

    return (
        <div className="justify-center h-full flex flex-row">
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className="max-w-lg w-full">
                <div className="flex items-center justify-between p-4">
                    <div className="flex flex-row items-center gap-2 text-[20px] font-semibold">
                        <img src={Top} alt="" />
                        <span>Dashboard</span>
                    </div>
                    <span
                        onClick={logout}
                        className="text-[#367AFF] cursor-pointer underline font-bold"
                    >
                        Sign Out
                    </span>
                </div>

                <UserCard />

                <div className="mx-4">
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#367AFF",
                            borderRadius: "10px",
                            textTransform: "none",
                            padding: "14px 16px",
                            margin: "20px 0px",
                        }}
                        onClick={() => {
                            setIsUpdate(false)
                            setOpen(true)
                        }}
                    >
                        Create Note
                    </Button>
                </div>

                <div className="mx-4">
                    <span>Notes</span>
                    {!loadingNotes && notes.length > 0 ? (
                        <NotesList handleRemove={handleRemove} onNoteClick={(note) => {
                            setTitle(note.title);
                            setContent(note.content);
                            setSelectedNote(note);
                            setIsUpdate(true);
                            setOpen(true);
                        }} list={notes} />
                    ) : (
                        <p>{loadingNotes ? "Loading..." : "No notes available"}</p>
                    )}
                </div>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Note</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Content"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#367AFF" }}
                        onClick={isUpdate ? handleUpdate : handleSave}
                    >
                        {isUpdate ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Dashboard
