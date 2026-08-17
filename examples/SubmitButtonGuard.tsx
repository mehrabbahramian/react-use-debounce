import { useState } from "react";
import { useDebounce } from "../src/useDebounce";

export function SubmitButtonGuard() {
  const [submitCount, setSubmitCount] = useState(0);

  const debouncedSubmit = useDebounce(() => {
    setSubmitCount((count) => count + 1);
  }, 1000);

  return (
    <div>
      <button type="button" onClick={() => debouncedSubmit()}>
        Submit
      </button>
      <p>Submitted {submitCount} time(s)</p>
    </div>
  );
}
