import { useState } from "react";
import { useDebounce } from "../src/useDebounce";

async function saveDraft(content: string): Promise<void> {
  await fetch("https://api.example.com/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export function AutoSaveForm() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const debouncedSave = useDebounce(async (value: string) => {
    setStatus("saving");
    await saveDraft(value);
    setStatus("saved");
  }, 800);

  return (
    <div>
      <textarea
        value={content}
        onChange={(event) => {
          const value = event.target.value;
          setContent(value);
          setStatus("idle");
          debouncedSave(value);
        }}
      />
      <p>Status: {status}</p>
      <button type="button" onClick={() => debouncedSave.cancel()}>
        Cancel pending save
      </button>
    </div>
  );
}
