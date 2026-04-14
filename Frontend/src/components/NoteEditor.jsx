import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import {
  LoaderCircle,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
} from "lucide-react";

import {
  ArrowLeft,
  Bold,
  Circle,
  CircleCheck,
  Italic,
  List,
  Trash,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NoteEditor = ({ note, updateNote, deleteNote, debounce, deleteId}) => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: note.content || "<p></p>",

    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      updateNote(note.id, { content });
      debounce(note.id, { content });
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(deleteId !== note.id);
    }
  }, [editor, deleteId, note.id]);

  function getStandardDateTime(arg) {
    const dateTime = new Date(arg);
    const date = dateTime.toISOString().split("T")[0];
    const time = dateTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return {
      date,
      time,
    };
  }

  function getBtnClass(active) {
    return `p-2 rounded transition cursor-pointer ${active ? "bg-gray-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`;
  }

  //   useEditor(() => {
  //     console.log(editor);
  //   }, [editor]);

  if (!editor || !note) return null;

  return (
    // <div className=""> </div>
    <div className="relative h-full overflow-y-auto flex flex-col">
      <div className="flex gap-4 items-center flex-wrap border-b border-gray-300 sticky top-0 p-2 bg-white z-50 border">
        <button
          className={getBtnClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </button>

        <button
          className={getBtnClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </button>

        <button
          className={getBtnClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </button>

        <button
          className={getBtnClass(editor.isActive("taskList"))}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CircleCheck />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={getBtnClass(editor.isActive({ textAlign: "left" }))}
        >
          <TextAlignStart />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={getBtnClass(editor.isActive({ textAlign: "center" }))}
        >
          <TextAlignCenter />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={getBtnClass(editor.isActive({ textAlign: "right" }))}
        >
          <TextAlignEnd />
        </button>

        {/* <div className="flex justify-end flex-1 items-center"> */}
        <button
          className={getBtnClass("")}
          onClick={() => {
            deleteNote(note.id);
          }}
          disabled={deleteId === note.id}
        >
          {deleteId === note.id ? (
            <LoaderCircle className="animate-spin duration-300 ease-in" />
          ) : (
            <Trash2 className="w-6 h-6 md:w-7 md:h-8" />
          )}
        </button>
        {/* </div> */}
      </div>

      <input
        type="text"
        className={`text-2xl md:text-3xl py-0.5 font-medium outline-0 focus:border-b-gray-200 focus:border-b-2 mt-4 mb-3 w-full px-3 ${deleteId === note.id && "opacity-40 pointer-events-none"}`}
        placeholder="Heading..."
        value={note.title}
        disabled={note.id === deleteId}
        onChange={(e) => {
          updateNote(note.id, { title: e.target.value });
          debounce(note.id, { title: e.target.value });
        }}
      />

      {/* 🔥 Toolbar */}

      {/* 📝 Editor */}
      <div
        className={`flex-1 [&>div]:h-full text-lg md:text-xl px-4 ${deleteId === note.id && "opacity-40 pointer-events-none"}`}
      >
        <EditorContent editor={editor} />
      </div>

      <div className="sticky bottom-0 right-0 left-0 p-1 flex gap-4 text-sm sm:text-base bg-white backdrop:blur-2xl px-3 py-2">
        <p>Updated_at:</p>
        <div className="flex gap-2">
          <p>{getStandardDateTime(note?.updated_at)?.date}</p>
          <>|</>
          <p>{getStandardDateTime(note?.updated_at)?.time}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
