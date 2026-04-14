import React, { useEffect, useState } from "react";
import api from "../../Files/axios";
import { useAuth } from "../context/AuthContext";
import { ArrowBigRight, Calendar, Check, CircleChevronRight, Save } from "lucide-react";
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
    setActiveRoutines,
  } = useAuth();
  // const [activeRoutines, setActiveRoutines] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editChecked, setEditChecked] = useState(false);
  const [editnote, setEditNote] = useState("");
  const {enqueueSnackbar} = useSnackbar()

  function isValidDate(date) {
    return new Date().toISOString().split("T")[0] >= date;
  }

  // console.log("Todo Loading...")
  // console.log("routines", routines);
  // console.log("entries", entries)
  // console.log("activeRoutines", activeRoutines);

  useEffect(() => {
    // console.log("current UE")
    // setEntries(routineEntry(currentDate));
    // console.log(routineEntry(currentDate) || []);
    // console.log("Curr:", currentDate)
    // getActiveRoutines();
    currentDateRoutineEntry();
  }, [currentDate]);

  // useEffect(() => {
  //   console.log("Entries UE", entries);
  // }, [entries]);

  // useEffect(() => {
  //   console.log("Valid ", currentDate)
  // }, [currentDate])

  // useEffect(() => {
  //   console.log(currentDate);
  //   console.log(editId || "id null");
  //   console.log(editChecked || "checked false");
  //   console.log(editnote || "note empty");
  // }, [editId, editChecked, editnote]);

  async function currentDateRoutineEntry() {
    try {
      if (isValidDate(currentDate)) {
        const response = await getRoutineEntryByFrom(currentDate);
        setEntries(response);
        // console.log("Today", " ", currentDate, " ", response);
      }
    } catch (err) {
      errorHandlerFn(err);
    }
  }

  function handleEdit(id, { completed, note }) {
    // console.log(completed);
    setEditId(id);
    setEditChecked(completed || false);
    setEditNote(note || "");
  }

  async function handleSubmit(entryId) {
    // console.log("Submit", entryId);
    try {
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
      setEditId(null);
      setEditChecked(false);
      setEditNote("");
    }
  }

  function getRoutineValue(routineId) {
    // console.log("I'm called by ", routineId)
    return (
      entries?.find(
        (entry) =>
          entry.routine === Number(routineId) && entry.date === currentDate,
      ) || {}
    );
  }

  return (
    <div className="sm:max-w-110 p-4 sm:px-6 shadow-xl rounded">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
        Todo
      </h2>
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
                  enqueueSnackbar("Sorry, You can't upload for future.", {variant: "info"});
                }
              }}
            />
          </div>
        </div>

        {
          activeRoutines.length > 0 ? (<div id="Routine List" className="flex flex-col gap-4 my-10">
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
                    >
                      <Save className="text-gray-700 h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>) : (<div className="my-10 font-semibold text-xl text-gray-500">
          Add Routine First
        </div>)
        }
      </div>
    </div>
  );
};

export default ToDo;
