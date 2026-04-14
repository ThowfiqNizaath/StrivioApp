import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { debounce } from "lodash";
import NoteEditor from "./NoteEditor";
import api from "../../Files/axios";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useSnackbar } from "notistack";

const NotePadId = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const { notes, setNotes, errorHandlerFn } = useAuth();
  const [notePadLoading, setNotePadLoading] = useState(true);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar()
  const [deleteId, setDeleteId] = useState(null)
  const debounceRef = useRef(null)
  

  useEffect(() => {
    return () => {
      debounceRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    if (notes.length > 0 && id) {

      const foundNote = notes.find((note) => note.id === Number(id));
      if(foundNote){
        setNote(foundNote)
      } else{
        navigate("/protected/notes");
      }
    
      setNotePadLoading(false);
    }
  }, [id, notes]);


  const debounceSaved = useMemo(() => {
    const fn = debounce(async (id, newdata) => {
      try {
          const response = await api.patch(`/api/notes/${id}/`, { ...newdata });
          setNotes((prev) =>{
            const exist = prev.find((note) => note.id === id);
            if(!exist) return prev;
            return prev.map((note) => note.id === id ? response.data : note)
          }
          );
      } catch (e) {
        errorHandlerFn(e);
      }
    }, 3000);

    debounceRef.current = fn

    return fn
  }, []);

  function updateNote(id, newData) {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...newData } : note)),
    );
  }

  async function deleteNote(id) {
    setDeleteId(id)
    debounceRef.current?.cancel();
    try {
      await api.delete(`/api/notes/${id}/`);
      
      setNotes((prev) => prev.filter((note) => note.id !== id));
      enqueueSnackbar("Note deleted successfully", {variant: "success"})
      navigate("/protected/notes");
    } catch (err) {
      errorHandlerFn(err);
    }finally{
      setDeleteId(null)
    }
  }

  return (
    <div className="shadow max-h-full h-full lg:w-[70%] xl:w-[60%] flex flex-col">
      {!notePadLoading && note ? (
        <NoteEditor
          note={note}
          updateNote={updateNote}
          deleteNote={deleteNote}
          debounce={debounceSaved}
          deleteId={deleteId}
        />
      ) : (
        <LoaderCircle className="animate-spin duration-300 ease-in" />
      )}

      <div className="m-4 absolute top-0 left-0">
        <button
          onClick={() => navigate("/protected/notes")}
          className="cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
};

export default NotePadId;
