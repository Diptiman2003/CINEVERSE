// import React from "react";
// import { newsStyles, newsCSS } from "../assets/dummyStyles";
// import { sampleNews } from "../assets/newdummydata";
// import { Image as ImageIcon, Sparkles, Clock, Calendar } from "lucide-react";

// const News = () => {
//     return (
//             <div className={newsStyles.container}>
//                 <style>
//                     {`@import url('https://fonts.googleapis.com/css?family=Monoton&family=Roboto:wght@300;400;700&display=swap');`}
//                 </style>
//                 <header className={newsStyles.header}>
//                     <div className={newsStyles.headerFlex}>
//                         <div className={newsStyles.logoContainer}>
//                             <div className={newsStyles.logoText}
//                                 style={{
//                                     fontFamily: "Monoton, cursive",
//                                 }}
//                             >
//                                 CineNews
//                             </div>
//                             <div
//                                 className={newsStyles.logoSubtitle}
//                                 style={{ fontFamily: "Roboto, sans-serif" }}
//                             >
//                                 Latest • Curated • Cinematic
//                             </div>
//                         </div>
//                         <div className={newsStyles.headerButtons}>
//                             <button className={newsStyles.latestNewsButton}>
//                                 <ImageIcon size={16} />
//                                 <span className={newsStyles.buttonText}>Latest News</span>
//                             </button>
//                         </div>
//                     </div>
//                     <div className={newsStyles.heroStripe}>
//                         <div className={newsStyles.featuredBadge}>Featured</div>
//                         <div className={newsStyles.stripeText}>
//                             {sampleNews[0].title} -- {sampleNews[0].excerpt}
//                         </div>
//                         <div className={newsStyles.stripeIcon}>
//                             <Sparkles size={16} className="text-red-500" />
//                         </div>
//                     </div>
//                 </header>
//                 <main className={newsStyles.main}>
//                         <section className={newsStyles.grid}>
//                             <article className={newsStyles.heroCard}>
//                                 <div className={newsStyles.heroImageContainer}>
//                                     <div className={newsStyles.heroImage}>
//                                         <img
//                                             src={sampleNews[0].image}
//                                             alt={sampleNews[0].title}
//                                             className={newsStyles.heroImg}
//                                             loading="eager"
//                                         />
//                                         <div className={newsStyles.heroOverlay}></div>
                                    
//                                     <div className={newsStyles.heroContent}>
//                                         <span className={newsStyles.heroCategory}>
//                                             {sampleNews[0].category}
//                                         </span>
//                                         <h1
//                                             className={newsStyles.heroTitle}
//                                             style={{
//                                                 fontFamily: "Roboto, sans-serif",
//                                             }}>
//                                             {sampleNews[0].title}
//                                         </h1>
//                                         <p className={newsStyles.heroExcerpt}>
//                                             {sampleNews[0].excerpt}
//                                         </p>
//                                     <div className={newsStyles.heroMeta}>
//                                         <div className={newsStyles.metaItem}>
//                                             <Clock size={16} />
//                                             <span className={newsStyles.metaText}>
//                                                 {sampleNews[0].time}
//                                             </span>
//                                         </div>
//                                         <div className={newsStyles.metaItem}>
//                                             <Calendar size={16} />
//                                             <span className={newsStyles.metaText}>
//                                                 {sampleNews[0].date}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className={newsStyles.heroStrip}>
//                             <div className={newsStyles.stripGrid}>
//                                 {sampleNews.slice(1, 4).map((item) => (
//                                     <article key={item.id} className={newsStyles.articleCard}>
//                                         <div className={newsStyles.articleImage}>
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.title}
//                                                 className={newsStyles.articleImg}
//                                                 loading="lazy"
//                                             />
//                                             <div className="absolute left-3 bottom-3">
//                                                 <span className={newsStyles.articleCategory}>
//                                                     {item.category}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className={newsStyles.articleContent}>
//                                             <div>
//                                                 <h3
//                                                     className={newsStyles.articleTitle}
//                                                     style={{
//                                                         fontFamily: 'Roboto'
//                                                     }} >
//                                                     {item.title}
//                                                 </h3>
//                                                 <p className={newsStyles.articleExcerpt}>
//                                                     {item.excerpt}
//                                                 </p>
//                                             </div>
//                                             <div className={newsStyles.articleSpacer}></div>
//                                         </div>
//                                     </article>
//                                    ))}
//                                    </div>
//                                 </div>
                                
//                             </article>
                    
//                     <aside className={newsStyles.sidebar}>
//                         {sampleNews.slice(4, 7).map((item) => (
//                             <div key={item.id} className={newsStyles.sidebarCard}>
//                                 <div className={newsStyles.sidebarCardInner}>
//                                     <div className={newsStyles.sidebarImage}>
//                                         <img src={item.image} alt={item.title} className={newsStyles.sidebarImg} loading="lazy" />
//                                     </div>
//                                     <div className={newsStyles.sidebarContent}>
//                                         <div className="flex items-start gap-2">
//                                             <span className={newsStyles.sidebarCategory}>{item.category}</span>
//                                         </div>
//                                         <h4 className={newsStyles.sidebarTitle} style={{ fontFamily: "Roboto, sans-serif" }}>{item.title}</h4>
//                                         <p className={newsStyles.sidebarExcerpt}>{item.excerpt}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                         <div className={newsStyles.subscribeCard}>
//                             <h5 className={newsStyles.subscribeTitle} style={{ fontFamily: "Roboto, sans-serif" }}>Join CineNews</h5>
//                             <p className={newsStyles.subscribeText}>Get curated cinematic news, exclusive behind-the-scenes, and early access to trailers.</p>
//                             <div className={newsStyles.subscribeForm}>
//                                 <input className={newsStyles.subscribeInput} placeholder="Email address" />
//                                 <button className={newsStyles.subscribeButton}>Subscribe</button>
//                             </div>
//                         </div>
//                     </aside>
//                     </section>
//                 </main>
//                 <style >{newsCSS}</style>
//             </div>
        
//     );
// };

// export default News;


//claude ai
// News.jsx
// Place in: frontend/src/components/News.jsx — replace existing

import React, { useEffect, useState } from "react";
import { newsStyles, newsCSS } from "../assets/dummyStyles";
import { Image as ImageIcon, Sparkles, Clock, Calendar, RefreshCw } from "lucide-react";

// ── NewsAPI Key ────────────────────────────────────────────────────────────
const NEWS_API_KEY = "9adfc0917a704d67ac86318329f43544";
const NEWS_URL     = `https://newsapi.org/v2/everything?q=cinema+movie+bollywood+hollywood&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`;

// ── Fallback image if article has no image ─────────────────────────────────
const FALLBACK_IMG = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80";

// ── Format date ────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  } catch { return ""; }
}

function formatTime(dateStr) {
  try {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit"
    });
  } catch { return ""; }
}

// ── Map article to sampleNews shape ───────────────────────────────────────
function mapArticle(article, index) {
  return {
    id:       index,
    title:    article.title?.replace(" - " + article.source?.name, "") || "Cinema News",
    excerpt:  article.description || article.content?.slice(0, 120) || "Latest cinema news",
    image:    article.urlToImage || FALLBACK_IMG,
    category: article.source?.name || "Cinema",
    date:     formatDate(article.publishedAt),
    time:     formatTime(article.publishedAt),
    url:      article.url || "#",
  };
}

// ─────────────────────────────────────────────────────────────────────────────

const News = () => {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(NEWS_URL);
      const data = await res.json();

      if (data.status === "ok" && data.articles?.length > 0) {
        // Filter articles that have images and valid titles
        const valid = data.articles
          .filter((a) => a.title && a.title !== "[Removed]" && a.urlToImage)
          .slice(0, 10)
          .map(mapArticle);

        if (valid.length > 0) {
          setNews(valid);
        } else {
          setError("No news found");
        }
      } else {
        setError(data.message || "Failed to fetch news");
      }
    } catch (err) {
      console.error("News fetch error:", err);
      setError("Failed to load news. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={newsStyles.container} style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(220,38,38,0.3)", borderTop: "3px solid #dc2626", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#8890a4", fontSize: "14px" }}>Loading latest cinema news...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (error || news.length === 0) {
    return (
      <div className={newsStyles.container} style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "#fca5a5", fontSize: "14px" }}>⚠️ {error || "No news available"}</p>
        <button
          onClick={fetchNews}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "8px", color: "#e63946", cursor: "pointer", fontSize: "13px" }}
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  // ── Main Render — same UI as before but with real data ───────────────────
  return (
    <div className={newsStyles.container}>
      <style>
        {`@import url('https://fonts.googleapis.com/css?family=Monoton&family=Roboto:wght@300;400;700&display=swap');`}
      </style>

      <header className={newsStyles.header}>
        <div className={newsStyles.headerFlex}>
          <div className={newsStyles.logoContainer}>
            <div className={newsStyles.logoText} style={{ fontFamily: "Monoton, cursive" }}>
              CineNews
            </div>
            <div className={newsStyles.logoSubtitle} style={{ fontFamily: "Roboto, sans-serif" }}>
              Latest • Curated • Cinematic
            </div>
          </div>
          <div className={newsStyles.headerButtons}>
            <button
              onClick={fetchNews}
              className={newsStyles.latestNewsButton}
              title="Refresh news"
            >
              <RefreshCw size={16} />
              <span className={newsStyles.buttonText}>Refresh</span>
            </button>
          </div>
        </div>

        {/* Hero Stripe — shows first news title */}
        <div className={newsStyles.heroStripe}>
          <div className={newsStyles.featuredBadge}>Featured</div>
          <div className={newsStyles.stripeText}>
            {news[0]?.title} -- {news[0]?.excerpt}
          </div>
          <div className={newsStyles.stripeIcon}>
            <Sparkles size={16} className="text-red-500" />
          </div>
        </div>
      </header>

      <main className={newsStyles.main}>
        <section className={newsStyles.grid}>

          {/* Hero Card — first news item */}
          <article className={newsStyles.heroCard}>
            <div className={newsStyles.heroImageContainer}>
              <div className={newsStyles.heroImage}>
                <img
                  src={news[0]?.image}
                  alt={news[0]?.title}
                  className={newsStyles.heroImg}
                  loading="eager"
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <div className={newsStyles.heroOverlay}></div>

                <div className={newsStyles.heroContent}>
                  <span className={newsStyles.heroCategory}>
                    {news[0]?.category}
                  </span>
                  <h1
                    className={newsStyles.heroTitle}
                    style={{ fontFamily: "Roboto, sans-serif", cursor: "pointer" }}
                    onClick={() => news[0]?.url && window.open(news[0].url, "_blank")}
                  >
                    {news[0]?.title}
                  </h1>
                  <p className={newsStyles.heroExcerpt}>
                    {news[0]?.excerpt}
                  </p>
                  <div className={newsStyles.heroMeta}>
                    <div className={newsStyles.metaItem}>
                      <Clock size={16} />
                      <span className={newsStyles.metaText}>{news[0]?.time}</span>
                    </div>
                    <div className={newsStyles.metaItem}>
                      <Calendar size={16} />
                      <span className={newsStyles.metaText}>{news[0]?.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strip — news items 1-3 */}
            <div className={newsStyles.heroStrip}>
              <div className={newsStyles.stripGrid}>
                {news.slice(1, 4).map((item) => (
                  <article
                    key={item.id}
                    className={newsStyles.articleCard}
                    style={{ cursor: "pointer" }}
                    onClick={() => item.url && window.open(item.url, "_blank")}
                  >
                    <div className={newsStyles.articleImage}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={newsStyles.articleImg}
                        loading="lazy"
                        onError={(e) => { e.target.src = FALLBACK_IMG; }}
                      />
                      <div className="absolute left-3 bottom-3">
                        <span className={newsStyles.articleCategory}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className={newsStyles.articleContent}>
                      <div>
                        <h3
                          className={newsStyles.articleTitle}
                          style={{ fontFamily: "Roboto" }}
                        >
                          {item.title}
                        </h3>
                        <p className={newsStyles.articleExcerpt}>
                          {item.excerpt}
                        </p>
                      </div>
                      <div className={newsStyles.articleSpacer}></div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar — news items 4-6 */}
          <aside className={newsStyles.sidebar}>
            {news.slice(4, 7).map((item) => (
              <div
                key={item.id}
                className={newsStyles.sidebarCard}
                style={{ cursor: "pointer" }}
                onClick={() => item.url && window.open(item.url, "_blank")}
              >
                <div className={newsStyles.sidebarCardInner}>
                  <div className={newsStyles.sidebarImage}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={newsStyles.sidebarImg}
                      loading="lazy"
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                  </div>
                  <div className={newsStyles.sidebarContent}>
                    <div className="flex items-start gap-2">
                      <span className={newsStyles.sidebarCategory}>{item.category}</span>
                    </div>
                    <h4
                      className={newsStyles.sidebarTitle}
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {item.title}
                    </h4>
                    <p className={newsStyles.sidebarExcerpt}>{item.excerpt}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Subscribe Card — kept same as before */}
            <div className={newsStyles.subscribeCard}>
              <h5 className={newsStyles.subscribeTitle} style={{ fontFamily: "Roboto, sans-serif" }}>
                Join CineNews
              </h5>
              <p className={newsStyles.subscribeText}>
                Get curated cinematic news, exclusive behind-the-scenes, and early access to trailers.
              </p>
              <div className={newsStyles.subscribeForm}>
                <input className={newsStyles.subscribeInput} placeholder="Email address" />
                <button className={newsStyles.subscribeButton}>Subscribe</button>
              </div>
            </div>
          </aside>

        </section>
      </main>

      <style>{newsCSS}</style>
    </div>
  );
};

export default News;
