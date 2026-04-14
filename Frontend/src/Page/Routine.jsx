import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../../Files/axios";
import { LoaderCircle, Plus, X } from "lucide-react";
import { useSnackbar } from "notistack";

const Routine = () => {
  const { categories, routines, setRoutines, errorHandlerFn } = useAuth();
  const [routine, setRoutine] = useState("");
  const [scheduledAt, setScheduledAt] = useState("00:00");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || null);
  const [editId, setEditId] = useState(null);
  const [editRoutine, setEditRoutine] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editScheduleAt, setEditScheduleAt] = useState("");
  const inputref = useRef(null);
  const [editActive, setEditActive] = useState(true);
  const [addRoutine, setAddRoutine] = useState(false);
  const [addRoutinePending, setAddRoutinePending] = useState(false)
  const [editRoutinePending, setEditRoutinePending] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const {enqueueSnackbar} = useSnackbar()

  // console.log(categories);
  // console.log(routines);

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  async function handleAddRoutine(e) {
    e.preventDefault();
    setAddRoutinePending(true)
    try {
      const response = await api.post("/api/routine/", {
        category: categoryId,
        name: routine,
        scheduled_at: scheduledAt,
      });
      // console.log(response.data)
      enqueueSnackbar("Routine added successfully", {variant: "success"});
      setRoutines((prev) => [...prev, response.data]);
      setAddRoutine(false);
      setRoutine("");
      setCategoryId(categories[0]?.id || null);
      setScheduledAt("00:00:00");
    } catch (err) {
      errorHandlerFn(err);
    } finally{
      setAddRoutinePending(false)
    }
  }

  async function deleteRotine(id) {
    setDeleteId(id)
    try {
      const response = await api.delete(`/api/routine/${id}/`);
      enqueueSnackbar("Routine deleted successfully", { variant: "success" });
      setRoutines((prev) => prev.filter((val) => val.id !== id));
    } catch (err) {
      errorHandlerFn(err);
    } finally{
      setDeleteId(null)
    }
  }

  function handleEditRoutine({ id, category, name, active, scheduled_at }) {
    setEditId(id);
    setEditCategoryId(category);
    setEditRoutine(name);
    setEditActive(active);
    setEditScheduleAt(scheduled_at);

    if (inputref.current === null) {
      setTimeout(() => inputref.current.focus(), 0);
    }
  }

  async function handleSubmit() {
    setEditRoutinePending(true)
    try {
      const response = await api.put(`/api/routine/${editId}/`, {
        category: editCategoryId,
        name: editRoutine,
        active: editActive,
        scheduled_at: editScheduleAt,
      });
      // console.log(response.data);
      enqueueSnackbar("Routine updated successfully", { variant: "success" });
      // enqueueSnackbar()
      setRoutines((prev) =>
        prev.map((val) => (val.id === editId ? response.data : val)),
      );
      setEditId(null);
      setEditCategoryId("");
      setEditRoutine("");
      setEditActive(true);
      setEditScheduleAt("00:00");
    } catch (err) {
      errorHandlerFn(err);
    }finally{
      setEditRoutinePending(false)
    }
  }

  return (
    <div>
      {/* Top Heading */}
      <div className="flex items-center gap-4 text-xl sm:text-2xl font-bold lg:text-3xl">
        <h2 className="">Routine</h2>

        {!addRoutine && categories.length > 0 && (
          <button
            className="cursor-pointer"
            onClick={() => setAddRoutine((p) => !p)}
          >
            <Plus />
          </button>
        )}
      </div>

      {addRoutine && categories.length > 0 && (
        <form
          onSubmit={handleAddRoutine}
          className="flex gap-x-8 gap-y-5 my-6 flex-wrap items-center"
        >
          <div className="flex items-center gap-3">
            <label
              className="text-sm md:text-base font-medium"
              htmlFor="category"
            >
              Category:
            </label>
            <select
              onChange={(e) => setCategoryId(Number(e.target.value))}
              value={categoryId}
              id="category"
              className="shadow px-4 py-1 text-base md:text-lg cursor-pointer"
            >
              {categories.map((cat, index) => (
                <option value={cat.id} key={index}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex gap-4 items-center lg:max-w-120">
            <label
              className="text-sm md:text-base font-medium"
              htmlFor="routineLable"
            >
              Routine:
            </label>
            <input
              id="routineLable"
              className="border border-gray-500 rounded flex-1 text-base md:text-lg px-4 py-0.5 cursor-pointer"
              value={routine}
              onChange={(e) => setRoutine(e.target.value)}
              placeholder="Gym, Walking......"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm md:text-base font-medium">
              Scheduled_at:{" "}
            </label>
            <input
              type="time"
              value={scheduledAt}
              className="shadow px-4 py-1 text-base md:text-lg cursor-pointer"
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button
              type="submit"
              className="border px-4 py-1 rounded font-semibold text-sm md:text-base cursor-pointer"
              disabled={addRoutinePending}
            >
              {addRoutinePending ? (
                <LoaderCircle className="animate-spin duration-300 ease-in" />
              ) : (
                "Add"
              )}
            </button>

            <button
              className="cursor-pointer"
              title="Close"
              onClick={() => {
                setAddRoutine(false);
                setRoutine("");
                setCategoryId(categories[0]?.id || null);
                setScheduledAt("00:00:00");
              }}
            >
              <X />
            </button>
          </div>
        </form>
      )}

      {/* List Routine */}
      {categories.length > 0 && routines.length > 0 ? (
        <div className="flex flex-col gap-4 my-10">
          {routines.map((item, index) => (
            <div
              key={item.id}
              className="shadow p-6 flex gap-5 justify-between items-center flex-wrap"
            >
              <div className="flex items-center gap-6 flex-wrap">
                <h5>{index + 1}</h5>
                <input
                  className="outline-0 focus:border-b-gray-400 focus:border-b-2 p-1 cursor-pointer"
                  value={editId === item.id ? editRoutine : item.name}
                  // disabled={editId !== item.id}
                  onChange={(e) => {
                    if (editId !== item.id) {
                      // First interaction → start editing this item
                      handleEditRoutine(item);
                    }

                    // Then update only value
                    setEditRoutine(e.target.value);
                  }}
                  ref={item.id === editId ? inputref : null}
                />
              </div>

              <select
                className="px-4 py-1 text-base md:text-lg cursor-pointer"
                // disabled={editId !== item.id}
                onChange={(e) => {
                  if (editId !== item.id) {
                    handleEditRoutine(item);
                  }

                  setEditCategoryId(Number(e.target.value));
                }}
                value={editId === item.id ? editCategoryId : item.category}
                // id="category"
              >
                {categories.map((cat, index) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 items-center">
                <label
                  htmlFor={`active_${item.id}`}
                  className="text-sm md:text-base font-semibold"
                >
                  Active:{" "}
                </label>
                <input
                  className="w-4 h-4 cursor-pointer"
                  type="checkbox"
                  id={`active_${item.id}`}
                  onChange={(e) => {
                    if (editId !== item.id) {
                      handleEditRoutine(item);
                    }

                    setEditActive(e.target.checked);
                  }}
                  checked={editId === item.id ? editActive : item.active}
                />
              </div>

              <div className="flex gap-3 items-center">
                <label
                  className="text-sm md:text-base font-semibold"
                  htmlFor={`scheduled_at_${item.id}`}
                >
                  Scheduled_at:
                </label>
                <input
                  className="cursor-pointer"
                  id={`scheduled_at_${item.id}`}
                  type="time"
                  value={
                    editId === item.id ? editScheduleAt : item.scheduled_at
                  }
                  onChange={(e) => {
                    if (editId !== item.id) {
                      handleEditRoutine(item);
                    }

                    setEditScheduleAt(e.target.value);
                  }}
                />
              </div>

              <div className="flex gap-4 sm:gap-6 items-center">
                {editId === item.id && (
                  <>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="border px-4 py-1 rounded font-semibold text-sm md:text-base cursor-pointer"
                      disabled={editRoutinePending}
                    >
                      {editRoutinePending && editId === item.id ? (
                        <LoaderCircle className="animate-spin duration-300 ease-in" />
                      ) : (
                        "Submit"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        setEditCategoryId("");
                        setEditRoutine("");
                        setEditActive(true);
                        setEditScheduleAt("00:00");
                      }}
                      className="rounded font-semibold text-sm md:text-base cursor-pointer"
                    >
                      <X />
                    </button>
                  </>
                )}

                <button
                  onClick={() => deleteRotine(item.id)}
                  className="border px-4 py-1 rounded font-semibold text-sm md:text-base cursor-pointer"
                  disabled={deleteId === item.id}
                >
                  {deleteId === item.id ? (
                    <LoaderCircle className="animate-spin duration-300 ease-in" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="my-10 font-semibold text-xl text-gray-500">
          {categories.length === 0
            ? "Please add category first"
            : "No Routines"}
        </div>
      )}
    </div>
  );
};

export default Routine;
