// //Movies.jsx
// import React, { useEffect, useState } from 'react'
// import { moviesStyles } from '../assets/dummyStyles'
// import movies from '../assets/dummymoviedata'
// import { Link } from 'react-router-dom'
// import { Ticket, Tickets } from 'lucide-react'
// //////////chatgpt
// const API_BASE = "http://localhost:5000"
// ////////////
// const PLACEHOLDER = "https://via.placeholder.com/400x600?text=No+Poster"
// /////////////////////////////////chatgpt
// const getUploadUrl = (maybe) => {
//   if (!maybe) return null
//   if (typeof maybe !== "string") return null
//   if (maybe.startsWith("http://") || maybe.startsWith("https://")) return maybe
//   return `${API_BASE}/uploads/${String(maybe).replace(/^uploads\//, "")}`
// }
// ////////////////////chatgpt
// const Movies = () => {
//   const [movies, setMovies] = useState([])
//   const [laoding, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const ac = new AbortController()
//     setLoading(true)
//     setError(null)

//     async function loadFeatureMovies() {
//       try {
//         const url = `${API_BASE}/api/movies?featured=true&limit=6` //remove by chatgpt
//         // const url = `http://localhost:5000/api/movies?featured=true&limit=6`//made by chatgpt

//         const res = await fetch(url, { signal: ac.signal })

//         if (!res.ok) throw new Error(`Fetch error :${res.status}`)
//         const json = await res.json()
//         // console.log(json)


//         const items = json.data ?? (Array.isArray(json) ? json : [])

//         const featuredOnly = items.filter(
//           (it) =>
//             it?.featured === true ||
//             it?.isFeatured === true ||
//             String(it?.type)?.toLowerCase() === "featured"
//         )
//         console.log(featuredOnly)

//         setMovies(featuredOnly.slice(0, 6))
//         setLoading(false)

//       } catch (err) {
//         if (err.name === 'AbortError') return
//         console.error('Movies load error:', err)
//         setError('Failed to load Movies')
//         setLoading(false)
//       }
//     }
//     loadFeatureMovies()
//     return () => ac.abort()
//   }, [])

//   const visibleMovies = movies.slice(0, 6)
//   return (
//     <section className={moviesStyles.container}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&display=swap')
//       `}</style>
//       <h2
//         style={{
//           fontFamily: " 'Sans serif'"
//           //  , cursive
//         }}
//         className={moviesStyles.title}>Featured Movies
//       </h2>

//       {laoding ? (
//         <div className='text-gray-300 py-12 text-center'> Loading movies...</div>


//       ) : error ? (
//         <div className='text-red-400 py-12 text-center'>{error}</div>
//       ) : movies.length === 0 ? (
//         <div className='text-gray-400 py-12 text-center '>
//           No featured movies found.
//         </div>
//       ) : (

//         <div className={moviesStyles.grid}>

//           {movies.map((m) => {
//             const rawImg =
//               m.poster || m.latestTrailer?.thumbnail || m.thumbnail || null

//             const imgSrc = getUploadUrl(rawImg) || PLACEHOLDER       //remove by chatgpt
//             // const imgSrc = rawImg || PLACEHOLDER
//             // 2nd chatgpt
//             // const imgSrc =
//             //   rawImg?.includes("cloudinary")
//             //       ? rawImg
//             //   : getUploadUrl(rawImg) || PLACEHOLDER
    
 
//               ///2chatgpt
//             const title = m.movieName || m.title || "Untitled"
//             const category =
//               (Array.isArray(m.categories) && m.categories[0]) ||
//               m.category ||
//               "General"
//             const movieId = m._id || m.id || title

//             return (

//               // <article
//               //   key={movieId}
//               //   className={moviesStyles.movieArticle}>
              
//               //   <Link to={`/movie/${moviesStyles.movieImage}`}
//               //     className={moviesStyles.movieLink}
//               //   >
//               //     <img
//               //       src={imgSrc}
//               //       alt={title}
//               //       loading="lazy"
//               //       className={moviesStyles.movieImage}
//               //       onError={(e) => {
//               //         e.currentTarget.src = PLACEHOLDER
//               //       }}

//               //     />

//               //   </Link>

//               //   <div className={moviesStyles.movieInfo}>
//               //     <div className={moviesStyles.titleContainer}>
//               //       <Tickets className={moviesStyles.ticketsIcon} />
//               //       <span id={`movie-title-${movieId}`}
//               //         className={moviesStyles.movieTitle}
//               //         style={{
//               //           fontFamily: " 'Sans serif' "
//               //           // ,cursive
//               //         }}
//               //       >
//               //         {title}
//               //       </span>

//               //     </div>
//               //     <div className={moviesStyles.categoryContainer}>
//               //       <span className={moviesStyles.categoryText}>
//               //         {category}
//               //       </span>
//               //     </div>
//               //   </div>
//               // </article>

//               <article
//   key={movieId}
//   className={moviesStyles.movieArticle}
// >
//   <Link
//     to={`/movie/${movieId}`}
//     className={moviesStyles.movieLink}
//   >
//     <img
//       src={imgSrc}
//       alt={title}
//       loading="lazy"
//       className={moviesStyles.movieImage}
//       onError={(e) => {
//         e.currentTarget.src = PLACEHOLDER
//       }}
//     />
//   </Link>

//   <div className={moviesStyles.movieInfo}>
//     <div className={moviesStyles.titleContainer}>
//       <Tickets className={moviesStyles.ticketsIcon} />
//       <span
//         id={`movie-title-${movieId}`}
//         className={moviesStyles.movieTitle}
//         style={{
//           fontFamily: "'Sans serif'"
//         }}
//       >
//         {title}
//       </span>
//     </div>

//     <div className={moviesStyles.categoryContainer}>
//       <span className={moviesStyles.categoryText}>
//         {category}
//       </span>
//     </div>
//   </div>
// </article>
//             )
//           })}
//         </div>





//       )}
//     </section>
//   )
// }


// export default Movies





// Movies.jsx
// Place in: frontend/src/components/Movies.jsx

import React, { useEffect, useState } from 'react'
import { moviesStyles } from '../assets/dummyStyles'
import { Link } from 'react-router-dom'
import { Tickets } from 'lucide-react'

const API_BASE   = "http://localhost:5000"
const PLACEHOLDER = "https://via.placeholder.com/400x600?text=No+Poster"

// ── Fixed: Cloudinary URLs returned as-is ─────────────────
const getImageUrl = (maybe) => {
  if (!maybe) return null
  if (typeof maybe !== "string") return null
  const raw = maybe.trim()
  if (!raw) return null
  // Cloudinary or any full URL — return as-is
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw
  // Local file — build localhost URL
  return `${API_BASE}/uploads/${raw.replace(/^uploads\//, "")}`
}

const Movies = () => {
  const [movies, setMovies]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    setError(null)

    async function loadMovies() {
      try {
        const res  = await fetch(`${API_BASE}/api/movies?limit=12`, { signal: ac.signal })
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`)
        const json = await res.json()
        const items = json.data ?? (Array.isArray(json) ? json : [])
        setMovies(items.slice(0, 12))
        setLoading(false)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Movies load error:', err)
        setError('Failed to load Movies')
        setLoading(false)
      }
    }

    loadMovies()
    return () => ac.abort()
  }, [])

  return (
    <section className={moviesStyles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&display=swap')
      `}</style>

      <h2
        className={moviesStyles.title}
        style={{ fontFamily: "'Sans serif', cursive" }}
      >
        Featured Movies
      </h2>

      {loading ? (
        <div className="text-gray-300 py-12 text-center">Loading movies...</div>

      ) : error ? (
        <div className="text-red-400 py-12 text-center">{error}</div>

      ) : movies.length === 0 ? (
        <div className="text-gray-400 py-12 text-center">No movies found.</div>

      ) : (
        <div className={moviesStyles.grid}>
          {movies.map((m) => {
            // ── Get poster URL ──────────────────────────────
            const rawImg = m.poster || m.thumbnail || m.latestTrailer?.thumbnail || null
            const imgSrc = getImageUrl(rawImg) || PLACEHOLDER

            const title    = m.movieName || m.title || "Untitled"
            const category = (Array.isArray(m.categories) && m.categories[0]) || m.category || "General"
            const movieId  = m._id || m.id || title

            return (
              <article key={movieId} className={moviesStyles.movieArticle}>
                <Link to={`/movies/${movieId}`} className={moviesStyles.movieLink}>
                  <img
                    src={imgSrc}
                    alt={title}
                    loading="lazy"
                    className={moviesStyles.movieImage}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
                  />
                </Link>

                <div className={moviesStyles.movieInfo}>
                  <div className={moviesStyles.titleContainer}>
                    <Tickets className={moviesStyles.ticketsIcon} />
                    <span
                      className={moviesStyles.movieTitle}
                      style={{ fontFamily: "'Sans serif', cursive" }}
                    >
                      {title}
                    </span>
                  </div>
                  <div className={moviesStyles.categoryContainer}>
                    <span className={moviesStyles.categoryText}>{category}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Movies
