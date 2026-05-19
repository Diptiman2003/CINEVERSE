import React, { useEffect, useState } from 'react'
import { moviesPageStyles } from '../assets/dummyStyles'
// import MOVIES from '../assets/dummymdata'
import { Link } from 'react-router-dom';

const API_BASE = "http://localhost:5000"
const COLLAPSE_COUNT = 12;
const PLACEHOLDER = "https://via.placeholder.com/400x600?text=No+Poster";

const getUploadUrl = (maybe) => {
  if (!maybe) return null;
  if (typeof maybe !== "string") return null;
  if (maybe.startsWith("http://") || maybe.startsWith("https://")) return maybe;
  return `${API_BASE}/uploads/${String(maybe).replace(/^uploads\//, "")}`;
};

const categoriesList = [
  { id: "all", name: "All Movies" },
  { id: "action", name: "Action" },
  { id: "horror", name: "Horror" },
  { id: "comedy", name: "Comedy" },
  { id: "adventure", name: "Adventure" },
];


const mapBackendMovie = (m) => {
  const id = m._id || m.id || "";
  const title = m.movieName || m.title || "Untitled";
  const rawImg = m.poster || m.latestTrailer?.thumbnail || m.thumbnail || null;
  const image = getUploadUrl(rawImg) || PLACEHOLDER;

  // pick first category (normalize to lowercase for category id comparisons)
  const cat =
    (Array.isArray(m.categories) && m.categories[0]) ||
    m.category ||
    (Array.isArray(m.latestTrailer?.genres) && m.latestTrailer.genres[0]) ||
    "General";

  const category = String(cat || "General");

  return { id, title, image, category, raw: m };
};


const MoviesPage = () => {

  const [activeCategory, setActiveCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [movies, setMovies] = useState([]);
  const [laoding, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const movies = MOVIES;
  // const filteredMovies = 
  // activeCategory === "all"
  // ? movies
  // :movies.filter((movies)=>movies.category === activeCategory);
  // const COLLAPSE_COUNT = 12;


  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null)

      try {
        const url = `${API_BASE}/api/movies?limit=200`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const json = await res.json();
        console.log(json);

        const items = Array.isArray(json.data) ? json.data : [];

        const mapped = items.map(mapBackendMovie);
        if (mounted) {
          setMovies(mapped);
          setLoading(false)
        }

      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Failed to load movies:", err);
        // fallback: try a generic fetch for any movies
        try {
          const res2 = await fetch(`${API_BASE}/api/movies?limit=200`);
          if (!res2.ok) throw new Error(`Fallback HTTP ${res2.status}`);
          const json2 = await res2.json();
          const items2 = Array.isArray(json2.items) ? json2.items : [];
          const mapped2 = items2.map(mapBackendMovie);
          if (mounted) {
            setMovies(mapped2);
            setLoading(false);
          }
        } catch (err2) {
          if (err2.name === "AbortError") return;
          console.error("Movies fallback failed:", err2);
          if (mounted) {
            setError("Unable to load movies.");
            setLoading(false);
          }
        }
      }


    }
    load();
    return () => {
      mounted = false;
      ac.abort();
    }



  }, [])

  // const filteredMovies = React.useMemo(() => {
  //   console.log(activeCategory);

  //   if (activeCategory === 'all') return movies;
  //   return movies.filter(
  //     (m) =>{
  //       console.log(m.categories, activeCategory);

  //       return String(m.categories || " ").toLowerCase() === String(activeCategory || " ").toLowerCase()
  //  } );
  // }, [movies, activeCategory]);
  // const filteredMovies = React.useMemo(() => {
  //   if (activeCategory === "all") return movies;

  //   const target = String(activeCategory || "").toLowerCase();

  //   return movies.filter((m) => {
  //     // support multiple shapes: m.categories (array), m.category (string), or raw.categories from backend
  //     const rawCats =
  //       Array.isArray(m.categories) ? m.categories :
  //         Array.isArray(m.raw?.categories) ? m.raw.categories :
  //           typeof m.category === "string" ? [m.category] :
  //             [];

  //     const normalized = rawCats
  //       .map((c) => (typeof c === "string" ? c : c?.name || c?.category || ""))
  //       .map((c) => String(c).toLowerCase().trim())
  //       .filter(Boolean);

  //     return normalized.includes(target);
  //   });
  // }, [movies, activeCategory]);

  const filteredMovies = React.useMemo(() => {
    if (activeCategory === "all") return movies;

    const target = String(activeCategory || "").toLowerCase().trim();

    return movies.filter((m) => {
      // 1) check mapped single-category (movie.category)
      if (String(m.category || "").toLowerCase().trim() === target) return true;

      // 2) check mapped/returned categories array (raw data)
      const rawCats =
        Array.isArray(m.categories) ? m.categories :
        Array.isArray(m.raw?.categories) ? m.raw.categories :
        [];

      for (const c of rawCats) {
        const name = typeof c === "string" ? c : c?.name || c?.category || "";
        if (String(name).toLowerCase().trim() === target) return true;
      }

      // 3) check latestTrailer genres as fallback
      const ltGenres = Array.isArray(m.raw?.latestTrailer?.genres)
        ? m.raw.latestTrailer.genres
        : [];
      if (ltGenres.some(g => String(g || "").toLowerCase().trim() === target)) return true;

      return false;
    });
  }, [movies, activeCategory]);


  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  const visiblesMovies = showAll ? filteredMovies : filteredMovies.slice(0, COLLAPSE_COUNT);

  // const categories =[
  //     {id:'all',name:'All Movies'},
  //     {id:'action',name:'Action'},
  //     {id:'horror',name:'Horror'},
  //     {id:'comedy',name:'Comedy'},
  //     {id:'adventure',name:'Adventure'}
  // ];
  return (
    <div className={moviesPageStyles.container}>
      <section className={moviesPageStyles.categoriesSection}>
        <div className={moviesPageStyles.categoriesContainer}>
          <div className={moviesPageStyles.categoriesFlex}>
            {categoriesList.map(category => (
              <button key={category.id} className={`${moviesPageStyles.categoryButton.base} ${activeCategory === category.id ?
                moviesPageStyles.categoryButton.active :
                moviesPageStyles.categoryButton.inactive
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className={moviesPageStyles.moviesSection}>
        <div className={moviesPageStyles.moviesContainer}>

          {laoding ? (
            <div className='py-12 text-center text-gray-300'>Loading movies....</div>
          ) : error ? (
            <div className='py-12 text-center text-red-400'>{error}</div>
          ) : (
            <>
              <div className={moviesPageStyles.moviesGrid}>
                {visiblesMovies.map((movie) => (
                  <Link
                    key={movie._id || movie.id}
                    to={`/movies/${movie._id || movie.id}`}
                    state={{ movie }}
                    className={moviesPageStyles.movieCard}
                  >
                    <div className={moviesPageStyles.movieImageContainer}>
                      <img src={movie.image} alt={movie.title}
                        className={moviesPageStyles.movieImage} />

                    </div>
                    <div className={moviesPageStyles.movieInfo}>
                      <h3 className={moviesPageStyles.movieTitle}>{movie.title}</h3>
                      <div className={moviesPageStyles.movieCategory}>
                        <span className={moviesPageStyles.movieCategoryText}>
                          {movie.category}
                        </span>
                      </div>

                    </div>
                  </Link>
                ))}

                {filteredMovies.length === 0 && (
                  <div className={moviesPageStyles.emptyState}
                    type='button'
                  >
                    No movies found in this cagtegory.
                  </div>
                )}

              </div>
            </>
          )}

          {filteredMovies.length > COLLAPSE_COUNT && (
            <div className={moviesPageStyles.showMoreContainer}>
              <button onClick={() => setShowAll((prev) => !prev)} className={moviesPageStyles.showMoreButton}>
                {showAll ? "Show Less" : `Show More(${filteredMovies.length - COLLAPSE_COUNT
                  } more)`}

              </button>
            </div>
          )}

        </div>

      </section>

    </div>
  )
}

export default MoviesPage;