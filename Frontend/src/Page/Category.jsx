import React, { useEffect, useRef, useState } from "react";
import api from "../../Files/axios";
import { useAuth } from "../context/AuthContext";
import { DeleteIcon, LoaderCircle, LoaderIcon, Plus, X } from "lucide-react";
import { useSnackbar } from "notistack";

const Category = () => {
  const [category, setCategory] = useState("");
  const { categories, setCategories, errorHandlerFn, getRoutines } = useAuth();
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const inputref = useRef(null);
  const [addCategory, setAddCategory] = useState(false);
  const {enqueueSnackbar} = useSnackbar()
  const [addCategoryPending, setAddCategoryPending] = useState(false)
  const [editCategoryPending, setEditCategoryPending] = useState(false)
  const [deleteId, setDeleteId] = useState(null)


  async function handleAddCategory(e) {
    e.preventDefault();
    setAddCategoryPending(true)
    try {
      const response = await api.post("/api/categories/", { name: category });
      setCategories((prev) => [...prev, response.data]);
      // console.log(response.data);
      enqueueSnackbar("Category added successfully", {variant: "success"})
      setAddCategory(false);
      setCategory("");
    } catch (err) {
      errorHandlerFn(err);
    }finally{
      setAddCategoryPending(false)
    }
  }

  async function deleteCategory(id) {
    if(deleteId === null){
      setDeleteId(id);
      try {
        const response = await api.delete(`/api/categories/${id}/`);
        if (response.data.success) {
          setCategories((prev) => prev.filter((cat) => cat.id != id));
          await getRoutines()
          enqueueSnackbar("Category deleted successfully", {
            variant: "success",
          });
        }
      } catch (err) {
        errorHandlerFn(err);
      } finally {
        setDeleteId(null);
      }
    }
  }

  function editCategory({ id, value }) {
    if(!editCategoryPending){
      setEditId(id);
      setEditValue(value);

      setTimeout(() => inputref.current.focus(), 0);
    }
  }

  async function submitCategory() {
    setEditCategoryPending(true)
    try {
      const response = await api.put(`/api/categories/${editId}/`, {
        name: editValue,
      });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editId ? response.data : cat)),
      );
      enqueueSnackbar("Category edited successfully", { variant: "success" });
      setEditId(null);
      setEditValue("");
    } catch (err) {
      errorHandlerFn(err);
    } finally{
      setEditCategoryPending(false)
    }
  }

  return (
    <div>
      {/* Category */}
      <div className="flex items-center gap-4 text-xl sm:text-2xl md:text-3xl font-bold">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Category</h2>
        {!addCategory && (
          <button
            className="cursor-pointer"
            onClick={() => setAddCategory((p) => !p)}
          >
            <Plus />
          </button>
        )}
      </div>

      {addCategory && (
        <form
          onSubmit={handleAddCategory}
          className="flex gap-x-8 gap-y-5 my-6 flex-wrap items-center"
        >
          <div className="flex items-center gap-3">
            <label className="text-sm md:text-base font-medium">
              Category:
            </label>
            <input
              type="text"
              className="border border-gray-500 rounded text-base md:text-lg px-4 py-0.5 cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-6">
            <button
              type="submit"
              className="border px-4 py-1 rounded font-semibold text-sm md:text-base cursor-pointer"
              disabled={addCategoryPending}
            >
              {addCategoryPending ? (
                <LoaderCircle className="animate-spin duration-300 ease-in" />
              ) : (
                "Add"
              )}
            </button>
            <button
              className="cursor-pointer"
              onClick={() => {
                setAddCategory(false);
                setCategory("");
              }}
            >
              <X />
            </button>
          </div>
        </form>
      )}

      {/* List Category */}
      {categories.length > 0 ? (
        <div className="flex flex-col gap-4 my-10">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex justify-between shadow p-6 gap-5 flex-wrap"
            >
              <p>{index + 1}</p>
              <input
                className="outline-0 focus:border-b-2 focus:border-b-gray-400 cursor-pointer"
                value={editId === cat.id ? editValue : cat.name}
                onChange={(e) => {
                  if(!editCategoryPending){
                    if (cat.id !== editId) {
                      editCategory(cat);
                    }
                    setEditValue(e.target.value);
                  }
                }}
                // disabled={cat.id !== editId}
                ref={cat.id === editId ? inputref : null}
                required
              />
              <div className="flex gap-4 sm:gap-6 items-center flex-wrap">

                {editId === cat.id && (
                  <>
                    <button
                      className="border px-4 py-1 rounded font-semibold text-sm md:text-base cursor-pointer"
                      onClick={submitCategory}
                      disabled = {editCategoryPending}
                    >
                      {
                        editCategoryPending ? <LoaderCircle className="animate-spin duration-300 ease-in" /> : "Submit"
                      }
                    </button>
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setEditId(null);
                        setEditValue("");
                      }}
                    >
                      <X />
                    </button>
                  </>
                )}

                <button
                  className="border px-4 py-1 rounded font-semibold text-sm md:text-base cursor-pointer"
                  onClick={() => deleteCategory(cat.id)}
                  disabled = {deleteId === cat.id}
                >
                  {
                    deleteId === cat.id ? <LoaderCircle className="animate-spin duration-300 ease-in" /> : "Delete"
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="my-10 font-semibold text-xl text-gray-500">
          No Categories
        </div>
      )}
    </div>
  );
};

export default Category;
