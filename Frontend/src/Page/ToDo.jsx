import React, { useEffect, useRef, useState } from "react";
import api from "../../Files/axios";
import { useAuth } from "../context/AuthContext";
import { Calendar, LoaderCircle, Save } from "lucide-react";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

const ToDo = () => {
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [entries, setEntries] = useState([]);
  const { getRoutineEntryByFrom, errorHandlerFn, activeRoutines } = useAuth();

  const [editId, setEditId] = useState(null);
  const [editChecked, setEditChecked] = useState(false);
  const [editnote, setEditNote] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [todoLoading, setTodoLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const dateRef = useRef();

  function isValidDate(date) {
    return new Date().toLocaleDateString("en-CA") >= date;
  }

  useEffect(() => {
    currentDateRoutineEntry();
  }, [currentDate]);

  async function currentDateRoutineEntry() {
    setTodoLoading(true)
    try {
      if (isValidDate(currentDate)) {
        const response = await getRoutineEntryByFrom(currentDate);
        setEntries(await response);
      }
    } catch (err) {
      errorHandlerFn(err);
    } finally {
      setTodoLoading(false);
    }
  }

  function handleEdit(id, { completed, note }) {
    if (!pending) {
      setEditId(id);
      setEditChecked(completed || false);
      setEditNote(note || "");
    }
  }

  async function handleSubmit(entryId) {
    try {
      setPending(true);
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
        enqueueSnackbar("Task updated successfully", { variant: "success" });
        setEntries((prev) => [...prev, response.data]);
      }
    } catch (err) {
      errorHandlerFn(err);
    } finally {
      setPending(false);
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


  const sortedRoutines = activeRoutines.sort((a, b) => {
    if (a.scheduled_at === "00:00:00") return 1; // move a to end
    if (b.scheduled_at === "00:00:00") return -1; // move b to end

    return a.scheduled_at.localeCompare(b.scheduled_at);
  });

  return (
    // sm:max-w-110 p-4 sm:px-6 shadow-xl rounded
    <div className="p-4 sm:px-6 shadow-xl card rounded-2xl">
      <h2 className="text-xl sm:text-2xl lg:text-3xl page-header">Todo</h2>
      {/* Today Rountine Todo */}
      <div>
        <div id="calendar" className="flex items-center gap-2">
          <div className="my-2 flex items-center gap-4 text-xl font-semibold">
            <p className="">Date:</p>
            <input
              ref={dateRef}
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
              className="outline-none cursor-pointer"
            />
          </div>
        </div>

        {activeRoutines.length > 0 && !todoLoading ? (
          // flex flex-col gap-4 my-10
          <div
            id="Routine List"
            // className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-4 my-10"
            className="my-10"
          >
            <table className=" w-full border-collapse">
              <thead className="table-header">
                <tr className="border-b border-[#EEEEEE]">
                  <th className="pb-2">Routine</th>
                  <th className="pb-2">Notes</th>
                  <th className="pb-2">Completed</th>
                </tr>
              </thead>
              <tbody className="">
                {sortedRoutines.map((item) => {
                  const entry = getRoutineValue(item.id);

                  return (
                    <tr key={item.id} className="border-b border-[#EEEEEE]">
                      {/* Left */}
                      <td className="pt-2">
                        {item.name}
                        {/* <h4 className="text-xl font-semibold mb-2"></h4> */}
                      </td>
                      <td className="pt-2">
                        <textarea
                          className="w-full shadow-xs p-2 cursor-text h-10"
                          value={
                            editId === item.id ? editnote : entry?.note || ""
                          }
                          placeholder="Note here..."
                          maxLength={150}
                          onChange={(e) => {
                            if (!pending) {
                              if (item.id !== editId) {
                                handleEdit(item.id, entry);
                              }
                              setEditNote(e.target.value);
                            }
                          }}
                        />
                      </td>

                      <td className="pt-2 flex flex-row justify-center gap-4 h-full mt-4">
                        <input
                          type="checkbox"
                          className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer accent-[#5932ea]"
                          onChange={(e) => {
                            if (!pending) {
                              if (editId !== item.id) {
                                handleEdit(item.id, entry);
                              }
                              setEditChecked(e.target.checked);
                            }
                          }}
                          checked={
                            editId === item.id
                              ? editChecked
                              : entry?.completed || false
                          }
                        />
                        {/* <div className=""> */}
                        {item.id === editId && (
                          <button
                            className="cursor-pointer"
                            title="save"
                            type="button"
                            onClick={() => handleSubmit(entry?.id)}
                            disabled={pending}
                          >
                            {pending ? (
                              <LoaderCircle className="animate-spin duration-300 ease-in" />
                            ) : (
                              <Save className="text-gray-700 h-6 w-6" />
                            )}
                          </button>
                        )}
                        {/* </div> */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : activeRoutines.length > 0 && todoLoading ? (
          <div className="h-[20vh] flex justify-center items-center">
            <LoaderCircle className="animate-spin duration-300 ease-in" />
          </div>
        ) : (
          <div className="my-10 font-semibold text-xl text-gray-500">
            No routines yet.{" "}
            <Link
              className="cursor-pointer text-blue-400 hover:text-blue-600"
              to="/protected/routine"
            >
              Add one to get started!
            </Link>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDo;
