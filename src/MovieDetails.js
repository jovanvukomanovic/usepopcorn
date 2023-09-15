import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useKey } from "./hooks/useKey";
import { Loader } from "./Loader";
import { KEY } from "./App";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched = [],
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  // with this useEffect we set up to see how many times is clicked on userRating, and that information persist on rerenders (simple counter to increment everytime when userRating is changed and rerenderd), if we put normal let variable instead countRef.curren we are going to lose count number on each rerender and we click 4t times only one click will be shown on let variable
  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const isWatched = watched?.map((movie) => movie.imdbID).includes(selectedId);

  const watchedUserRating = watched?.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      // while runtime have min after number we take split method to divide from min, and that only string number convert to number
      runtime: Number(runtime.split("").at(0)),
      userRating,
      // how many times is clicked on rating before submited to watched list
      countRatingDesisons: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  useKey("Escape", onCloseMovie);
  // this use effect bellow is for closing movie details component on esc keypress
  // useEffect(() => {
  //   function callback(e) {
  //     if (e.code === "Escape") {
  //       onCloseMovie();
  //     }
  //   }
  //   document.addEventListener("keydown", callback);
  //   return () => {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, [onCloseMovie]);
  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        if (!res.ok) throw new Error("something went wrong with fetch movie");

        const data = await res.json();

        if (data.Response === "False") throw new Error("the movie not found");

        setMovie(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}{" "}
              </p>
              <p>{genre}</p>

              <p>
                <span>⭐ </span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}{" "}
                </>
              ) : (
                <p>
                  You rated this movie <span>{watchedUserRating} ⭐ </span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
