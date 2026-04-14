import React, { useEffect, useState } from "react";
import api from "../../Files/axios";
import { useAuth } from "../context/AuthContext";
import { ArrowBigRight, Calendar, Check, CircleChevronRight, LoaderCircle, Save } from "lucide-react";
import { useSnackbar } from "notistack";

const ToDo = () => {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [entries, setEntries] = useState([]);
  const {
    getRoutineEntryByFrom,
    errorHandlerFn,
    activeRoutines,
  } = useAuth();
 
  const [editId, setEditId] = useState(null);
  const [editChecked, setEditChecked] = useState(false);
  const [editnote, setEditNote] = useState("");
  const {enqueueSnackbar} = useSnackbar()
  const [todoLoading, setTodoLoading] = useState(true)
  const [pending, setPending] = useState(false)

  function isValidDate(date) {
    return new Date().toISOString().split("T")[0] >= date;
  }

  useEffect(() => {
    currentDateRoutineEntry();
  }, [currentDate]);

  async function currentDateRoutineEntry() {
    try {
      if (isValidDate(currentDate)) {
        const response = await getRoutineEntryByFrom(currentDate);
        setEntries(await response);
      }
    } catch (err) {
      errorHandlerFn(err);
    } finally{
      setTodoLoading(false)
    }
  }

  function handleEdit(id, { completed, note }) {
    setEditId(id);
    setEditChecked(completed || false);
    setEditNote(note || "");
  }

  async function handleSubmit(entryId) {
    try {
      setPending(true)
      if (entryId) {
        const response = await api.put(`/api/routineEntry/${entryId}/`, {
          date: currentDate,
          routine: editId,
          completed: editChecked,
          note: editnote,
        });
        enqueueSnackbar("Task updated successfully", { variant: "success" });
        setEntries((prev) =>
          prev.map((val) => (val.id === entryId ? response.data : val)),
        );
      } else {
        const response = await api.post(`/api/routineEntry/`, {
          date: currentDate,
          routine: editId,
          completed: editChecked,
          note: editnote,
        });
        setEntries((prev) => [...prev, response.data]);
      }
    } catch (err) {
      errorHandlerFn(err);
    } finally {
      setPending(false)
      setEditId(null);
      setEditChecked(false);
      setEditNote("");
    }
  }

  function getRoutineValue(routineId) {
    return (
      entries?.find(
        (entry) =>
          entry.routine === Number(routineId) && entry.date === currentDate,
      ) || {}
    );
  }

  return (
    <div className="sm:max-w-110 p-4 sm:px-6 shadow-xl rounded">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Todo</h2>
      {/* Today Rountine Todo */}
      <div>
        <div id="calendar" className="flex items-center gap-2">
          <div className="my-2 flex items-center gap-2 text-xl font-semibold">
            <p className="">Date:</p>
            <p className="font-medium">{currentDate}</p>
          </div>
          <div className="relative inline-block w-6 h-6">
            <Calendar className="w-full h-full" />
            <input
              id="calenderTodo"
              className="absolute inset-0 opacity-0 cursor-pointer z-50"
              type="date"
              value={currentDate}
              onChange={(e) => {
                if (isValidDate(e.target.value)) {
                  setCurrentDate(e.target.value);
                } else {
                  enqueueSnackbar("Sorry, You can't upload for future.", {
                    variant: "info",
                  });
                }
              }}
            />
          </div>
        </div>

        {activeRoutines.length > 0 && !todoLoading ? (
          <div id="Routine List" className="flex flex-col gap-4 my-10">
            {activeRoutines.map((item) => {
              const entry = getRoutineValue(item.id);

              return (
                <div key={item.id} className="shadow p-6 flex gap-5">
                  {/* Left */}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold mb-2">{item.name}</h4>

                    <textarea
                      className="w-full shadow-xs p-2 cursor-pointer"
                      value={editId === item.id ? editnote : entry?.note || ""}
                      placeholder="Note here..."
                      onChange={(e) => {
                        if (item.id !== editId) {
                          handleEdit(item.id, entry);
                        }
                        setEditNote(e.target.value);
                      }}
                    />
                  </div>

                  {/* Right */}
                  <div className="flex flex-col justify-between items-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer"
                      onChange={
                        (e) => {
                          if (editId !== item.id) {
                            handleEdit(item.id, entry);
                          }
                          setEditChecked(e.target.checked);
                        }
                        // handleEdit(item.id, e.target.checked, entry?.note || "")
                      }
                      checked={
                        editId === item.id
                          ? editChecked
                          : entry?.completed || false
                      }
                    />

                    {item.id === editId && (
                      <button
                        className="cursor-pointer"
                        title="save"
                        type="button"
                        onClick={() => handleSubmit(entry?.id)}
                        disabled = {pending}
                      >
                        {
                          pending ? <LoaderCircle className="animate-spin duration-300 ease-in"/> : <Save className="text-gray-700 h-6 w-6" />
                        }
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeRoutines.length > 0 && todoLoading ? (
          <div className="h-[20vh] flex justify-center items-center">
            <LoaderCircle className="animate-spin duration-300 ease-in" />
          </div>
        ) : (
          <div className="my-10 font-semibold text-xl text-gray-500">
            Add Routine First
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDo;
