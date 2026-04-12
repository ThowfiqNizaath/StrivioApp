// import React, { useCallback, useEffect, useMemo, useState } from "react";
import NoteEditor from "../components/NoteEditor";
import { useAuth } from "../context/AuthContext";
import api from "../../Files/axios";
import DOMPurify from "dompurify";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const NotePad = () => {
  const { notes, setNotes, errorHandlerFn } = useAuth();
  const navigate = useNavigate();
  const {enqueueSnackbar}  = useSnackbar()

  async function addNote() {
    try {
      const response = await api.post("/api/notes/", {
        title: "",
        content: "",
      });
      // console.log(response.data);
      setNotes((prev) => [...prev, response.data]);
      enqueueSnackbar("Note added successfully", {variant:"success"})
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  // const debounceSaved = useMemo(() => {
  //    return debounce(async(id, newdata) => {
  //     const response = await api.patch(`/api/notes/${id}/`, {...newdata})
  //     console.log(response.data)
  //     setNotes((prev) =>
  //       prev.map((note) => (note.id === id ? response.data : note)),
  //     );
  //   }, 3000)
  // }, [])

  // function updateNote(id, newData) {
  //   setNotes((prev) =>
  //     prev.map((note) => (note.id === id ? { ...note, ...newData } : note)),
  //   );
  // }

  // async function deleteNote(id) {
  //   try {
  //     await api.delete(`/api/notes/${id}/`);
  //     setNotes((prev) => prev.filter((note) => note.id !== id));
  //   } catch (err) {
  //     errorHandlerFn(err);
  //   }
  // }

  return (
    <div className="min-h-full relative">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Notes</h2>
      </div>

      <button
        type="button"
        className="fixed bottom-5 right-5 z-100 p-2 rounded-full bg-white backdrop:blur-2xl cursor-pointer"
        onClick={addNote}
      >
        <Plus className=" w-8 h-8 lg:w-12 lg:h-12" />
      </button>
      {/* Notes */}
      {notes.length > 0 ? (
        <div className="my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {notes.map((note) => (
            <div
              key={`notes_${note.id}`}
              className="shadow p-4 cursor-pointer "
              onClick={() => navigate(`/protected/notes/${note.id}`)}
            >
              {note?.title ? (
                <h2 className="text-2xl md:text-3xl font-bold truncate">
                  {note?.title}
                </h2>
              ) : (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-400">
                  Heading...
                </h2>
              )}

              {note?.content ? (
                <div
                  className="my-4 max-h-50 truncate text-sm sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(note?.content || ""),
                  }}
                />
              ) : (
                <p className="py-2 text-gray-400">
                  Buy groceries: milk, eggs, bread, and fruits. Don't forget to
                  check for discounts. Call John regarding the project update.
                  Prepare questions before the meeting.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="my-10 font-semibold text-xl text-gray-500">
          No Notes
        </div>
      )}
    </div>
  );
};

export default NotePad;
