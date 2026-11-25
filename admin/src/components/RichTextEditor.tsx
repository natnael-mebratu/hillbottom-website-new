import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

// Stores/loads real HTML (h2/h3/p/ul/ol/blockquote/strong/em/a) — the
// public site renders this straight through (see coverImg()'s sibling in
// parts.mjs, the article body no longer runs text through the old
// "guess which short line is a heading" heuristic). Admin-authored only
// (requireAdmin-protected), so trusting this HTML on the public side is
// the same trust boundary every other admin-entered field already has.
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-edit min-h-[220px] max-h-[480px] overflow-y-auto px-3 py-2.5 text-sm text-white/85 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const btnCls = (active: boolean) =>
    `px-2.5 py-1.5 text-xs font-semibold rounded ${active ? "bg-[#c09a60] text-[#07111f]" : "text-white/60 hover:text-white hover:bg-white/10"}`;

  return (
    <div className="border border-white/15 bg-[#0a1420] rounded">
      <div className="flex flex-wrap gap-1 border-b border-white/10 p-1.5">
        <button type="button" className={btnCls(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button type="button" className={btnCls(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button type="button" className={btnCls(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btnCls(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className={btnCls(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet list</button>
        <button type="button" className={btnCls(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered list</button>
        <button type="button" className={btnCls(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button
          type="button"
          className={btnCls(editor.isActive("link"))}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else if (url === "") editor.chain().focus().unsetLink().run();
          }}
        >
          Link
        </button>
        <button type="button" className={btnCls(false)} onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button type="button" className={btnCls(false)} onClick={() => editor.chain().focus().redo().run()}>Redo</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
