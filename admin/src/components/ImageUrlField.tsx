import { useRef, useState } from "react";
import { api } from "@/lib/apiClient";

// Standardized control for every *Url field that holds an image (team
// photo, testimonial photo, hero image, blog cover, logo, …): a plain
// text input (paste a URL, as before) plus an "Upload" button that posts
// the file to /api/uploads and fills the field with the result, so admins
// don't need to host images elsewhere first. Used wherever Admin.tsx
// previously had a bare <input placeholder="... URL">.
export function ImageUrlField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder: string;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="admin-input flex-1"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
          className="shrink-0 border border-white/15 px-3 text-xs uppercase tracking-widest text-white/60 hover:text-white disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-xs text-red-300/80">{error}</p>}
      {value && !error && (
        <img
          src={value}
          alt=""
          className="h-16 w-16 rounded object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
          onLoad={(e) => (e.currentTarget.style.display = "block")}
        />
      )}
    </div>
  );
}
