import { useState } from "react";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { NavBar } from "./NavBar";
import { NumResults } from "./NumResults";
import { Search } from "./Search";
import { ErrorMessage } from "./ErrorMessage";
import { Loader } from "./Loader";
import { Main } from "./Main";
import { Box } from "./Box";
import { MoviesList } from "./MoviesList";
import { MovieDetails } from "./MovieDetails";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMoviesList } from "./WatchedMoviesList";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "e29cd077";

export default function App() {
  const [query, setQuery] = useState("");

  // this state bellow is setted to start with localStorage data, this data only matters as value on start of component, on return is setted if is nothing in localStorage that return empty array. that function in useState must be pure(no side effects: data fetching...)
  // const [watched, setWatched] = useState(function () {
  //   const stored = localStorage.getItem("watched");
  //   return JSON.parse(stored) || [];
  // });

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  // console.log(selectedId);

  function handleSelectMovieId(id) {
    // if i click on same movie to close but if i click on another to open another
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // when put state on local storage from function where that state is updated, we cannot simply put that state as second argument, because that state is stale (state is not updated yet in function), so if we must update localStorage and state in this same function , in use effect that is not the problem because state is updated

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // setting local storage from useEffect
  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched]);

  // // this useEffect below and fetching data could be handled with event handler ,on click or on change in input, because that is prefered way of fetching data in React, and there is no need for useEffect hook in this case, so I can later make to function on event handler,  also  when component mount we seee no data , but when we start typing (that is also sign that we no need useEffect , because we dont need data on mount)
  // useEffect(() => {
  //   const controller = new AbortController();
  //   async function fetchMovies() {
  //     try {
  //       setIsLoading(true);
  //       setError("");
  //       const res = await fetch(
  //         `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //         { signal: controller.signal }
  //       );

  //       if (!res.ok) throw new Error("something went wrong with fetch movies");

  //       const data = await res.json();

  //       if (data.Response === "False") throw new Error("the movie not found");

  //       setMovies(data.Search);
  //       setIsLoading(false);
  //       setError("");
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         console.log(err.message);
  //         setError(err.message);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   // to set if we no type(or is less that three) in search bar to show nothing
  //   if (query.length < 3) {
  //     setError("");
  //     setMovies([]);
  //     return;
  //   }
  //   // to  close previous search when another search starts, with handle close movie
  //   handleCloseMovie();

  //   fetchMovies();

  //   return function () {
  //     controller.abort();
  //   };
  // }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* test with element way of child components */}

        {/* <Box element={<MoviesList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />

              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}
        <Box>
          {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}

          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectedMovie={handleSelectMovieId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
