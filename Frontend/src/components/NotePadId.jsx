import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { debounce } from "lodash";
import NoteEditor from "./NoteEditor";
import api from "../../Files/axios";
import { ArrowLeft } from "lucide-react";
import { useSnackbar } from "notistack";

const NotePadId = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const { notes, setNotes, errorHandlerFn } = useAuth();
  const [notePadLoading, setNotePadLoading] = useState(true);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar()
  

  useEffect(() => {
    if (notes.length > 0 && id) {
      // console.log();
      setNote(notes.find((item) => item.id === Number(id)));
      setNotePadLoading(false);
    }
  }, [id, notes]);

  // useEffect(() => console.log(note), [note]);

  const debounceSaved = useMemo(() => {
    return debounce(async (id, newdata) => {
      try {
        const response = await api.patch(`/api/notes/${id}/`, { ...newdata });
        // console.log(response.data);
        setNotes((prev) =>
          prev.map((note) => (note.id === id ? response.data : note)),
        );
      } catch (e) {
        errorHandlerFn(e);
      }
    }, 3000);
  }, []);

  function updateNote(id, newData) {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...newData } : note)),
    );
  }

  async function deleteNote(id) {
    try {
      await api.delete(`/api/notes/${id}/`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      enqueueSnackbar("Note deleted successfully", {variant: "success"})
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  return (
    <div className="shadow max-h-full h-full lg:w-[70%] xl:w-[60%] flex flex-col">
      {!notePadLoading ? (
        <NoteEditor
          key={note.id}
          note={note}
          updateNote={updateNote}
          deleteNote={deleteNote}
          debounce={debounceSaved}
        />
      ) : (
        <div>Loading.....</div>
      )}

      <div className="m-4 absolute top-0 left-0">
        <button onClick={() => navigate("/protected/notes")} className="cursor-pointer">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
};

export default NotePadId;
