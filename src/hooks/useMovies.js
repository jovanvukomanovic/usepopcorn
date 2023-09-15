import { useState, useEffect } from "react";

const KEY = "e29cd077";

// we can make this hook more reusable as we can set these parameters a generic name for example handleCloseMovie we can rename as callback , and to use in multiple projects, without renaming functions in these custom hook
export function useMovies(query, handleCloseMovie) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // this useEffect below and fetching data could be handled with event handler ,on click or on change in input, because that is prefered way of fetching data in React, and there is no need for useEffect hook in this case, so I can later make to function on event handler,  also  when component mount we seee no data , but when we start typing (that is also sign that we no need useEffect , because we dont need data on mount)
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("something went wrong with fetch movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("the movie not found");

        setMovies(data.Search);
        setIsLoading(false);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    // to set if we no type(or is less that three) in search bar to show nothing
    if (query.length < 3) {
      setError("");
      setMovies([]);
      return;
    }
    // to  close previous search when another search starts, with handle close movie. We set optional chaining with ?.  if there is no second parameter in custom hook ,in this case function handleCloseMovie(). We can give generic name of function, to improve reusability
    handleCloseMovie?.();

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
