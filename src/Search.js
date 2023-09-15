import { useRef } from "react";
import { useKey } from "./hooks/useKey";

export function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  // // we changed this with custom useKey hook
  // useEffect(() => {
  //   function callback(e) {
  //     // with these we prevent of focusing and deleting what is typed in input , if is input already focused
  //     if (document.activeElement === inputEl.current) return;
  //     // to be setted only on enter key to focus element and to delete what was typed before
  //     if (e.code === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   }
  //   document.addEventListener("keydown", callback);
  //   return () => document.removeEventListener("keydown", callback);
  // }, [setQuery]);
  // with custom hook
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
