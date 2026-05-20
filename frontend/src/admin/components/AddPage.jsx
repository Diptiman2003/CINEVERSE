import React, { useEffect, useRef, useState } from 'react'
import { addMoviePageStyles, addMoviePageCustomStyles } from '../assets/dummyStyles.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Film, Image as ImageIcon, Play, Star, Clock, Plus, X, Upload, Users } from 'lucide-react';
const API_HOST = 'http://localhost:5000'
const AddPage = () => {
  //form state
  const [movieName, setMovieName] = useState("");
  const [categories, setCategories] = useState([]);
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [rating, setRating] = useState(7.5);
  const [duration, setDuration] = useState(120);
  const [slots, setSlots] = useState([
    { id: Date.now(), date: "", time: "", ampm: "AM" },
  ]);
  const [castImages, setCastImages] = useState([]);
  const [directorImages, setDirectorImages] = useState([]);
  const [producerImages, setProducerImages] = useState([]);
  const [story, setStory] = useState("");
  const [movieType, setMovieType] = useState("normal");


  //seat
  const [standardSeatPrice, setStandardSeatPrice] = useState(0);
  const [reclinerSeatPrice, setReclinerSeatPrice] = useState(0);

  // ── MRP (original price before discount) ──────────────────────────────────
  const [mrpStandardPrice, setMrpStandardPrice] = useState(0);
  const [mrpReclinerPrice, setMrpReclinerPrice]  = useState(0);

  // ── Festival / Discount Banner ─────────────────────────────────────────────
  const [bannerEnabled,   setBannerEnabled]   = useState(false);
  const [bannerTitle,     setBannerTitle]     = useState("");
  const [bannerSubtitle,  setBannerSubtitle]  = useState("");
  const [bannerBgColor,   setBannerBgColor]   = useState("#FF6B00");
  const [bannerTextColor, setBannerTextColor] = useState("#FFFFFF");
  const [bannerBadge,     setBannerBadge]     = useState("");
  const [bannerExpiry,    setBannerExpiry]    = useState("");


  //latresttrailer
  const [ltDurationHours, setLtDurationHours] = useState(1);
  const [ltDurationMinutes, setLtDurationMinutes] = useState(30);
  const [ltYear, setLtYear] = useState(new Date().getFullYear());
  const [ltDescription, setLtDescription] = useState("");
  const [ltThumbnail, setLtThumbnail] = useState(null);
  const [ltThumbnailPreview, setLtThumbnailPreview] = useState(null);
  const [ltVideoUrl, setLtVideoUrl] = useState("");
  const [ltDirectorImages, setLtDirectorImages] = useState([]);
  const [ltProducerImages, setLtProducerImages] = useState([]);
  const [ltSingerImages, setLtSingerImages] = useState([]);

  const fileInputRef = useRef();


  // duration hours/minutes local state for normal & featured
  const [durationHours, setDurationHours] = useState(Math.floor(duration / 60));
  const [durationMinutes, setDurationMinutes] = useState(duration % 60);

  // auditorium state & available options
  const availableAuditoriums = ["Audi 1", "Audi 2", "Audi 3"];
  const [auditorium, setAuditorium] = useState("Audi 1");
  const [customAuditorium, setCustomAuditorium] = useState("");

  // uploading indicator
  const [isUploading, setIsUploading] = useState(false);

  //to calculate
  useEffect(() => {
    const total =
      (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0);
    setDuration(total);
  }, [durationHours, durationMinutes]);


  //available category
  const availableCategories = ["Action", "Horror", "Comedy", "Adventure"];

  function toggleCategory(cat) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }


  // file helpers that renders the image uploads by user.
  const handlePosterChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPoster(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPosterPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleLtThumbnailChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setLtThumbnail(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLtThumbnailPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = null;
  };


  // generalized helpers for reading multiple files to preview with optional meta
  const readFilesToPreviewsWithMeta = (files, setter, metaType = null) => {
    const arr = Array.from(files);
    const readers = arr.map((file) => {
      return new Promise((res) => {
        const r = new FileReader();
        r.onload = (e) =>
          res({
            file,
            preview: e.target.result,
            ...(metaType === "name" ? { name: "" } : {}),
            ...(metaType === "nameRole" ? { name: "", role: "" } : {}),
          });
        r.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((items) => {
      setter((prev) => [...prev, ...items]);
    });
  };

  const handleMultipleFiles = (e, setter, metaType = null) => {
    if (!e.target.files) return;
    readFilesToPreviewsWithMeta(e.target.files, setter, metaType);
    e.target.value = null;
  }; // can see multi imgs renders


  const readFilesToNamedPreviews = (files, setter) => {
    const arr = Array.from(files);
    const readers = arr.map((file) => {
      return new Promise((res) => {
        const r = new FileReader();
        r.onload = (e) => res({ file, preview: e.target.result, name: "" });
        r.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((items) => {
      setter((prev) => [...prev, ...items]);
    });
  };


  const handleMultipleNamedFiles = (e, setter) => {
    if (!e.target.files) return;
    readFilesToNamedPreviews(e.target.files, setter);
    e.target.value = null;
  };

  const removePreview = (id, setter) => {
    setter((prev) => prev.filter((p, idx) => idx !== id));
  };

  const updateNamedItemName = (idx, setter, value) => {
    setter((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, name: value } : it))
    );
  };

  const updateMetaField = (idx, setter, field, value) => {
    setter((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );
  };


  // slots helpers add remove and update slot timings for a movie
  function addSlot() {
    setSlots((s) => [
      ...s,
      { id: Date.now() + Math.random(), date: "", time: "", ampm: "AM" },
    ]);
  }
  function removeSlot(id) {
    setSlots((s) => s.filter((slot) => slot.id !== id));
  }
  function updateSlot(id, field, value) {
    setSlots((s) =>
      s.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  }

  //it restes the field once the data gets submitted to server
  function resetForm() {
    setMovieName("");
    setCategories([]);
    setPoster(null);
    setPosterPreview(null);
    setTrailerUrl("");
    setVideoUrl("");
    setRating(7.5);
    setDuration(120);
    setDurationHours(Math.floor(120 / 60));
    setDurationMinutes(120 % 60);
    setSlots([{ id: Date.now(), date: "", time: "", ampm: "AM" }]);
    setCastImages([]);
    setDirectorImages([]);
    setProducerImages([]);
    setStory("");
    setMovieType("normal");
    setStandardSeatPrice(0);
    setReclinerSeatPrice(0);
    setLtDurationHours(1);
    setLtDurationMinutes(30);
    setLtYear(new Date().getFullYear());
    setLtDescription("");
    setLtThumbnail(null);
    setLtThumbnailPreview(null);
    setLtVideoUrl("");
    setLtDirectorImages([]);
    setLtProducerImages([]);
    setLtSingerImages([]);
    setAuditorium("Audi 1");
    setCustomAuditorium("");
  }


  //this function validates all the field are filled or not with correct details.
  function validate() {
    if (movieType === "latestTrailers") {
      if (!movieName.trim()) return "Please enter title for latest trailer.";
      if (!categories.length)
        return "Please choose at least one genre for latest trailer.";
      if (!ltThumbnail)
        return "Please select a thumbnail image for latest trailer.";
      if (!ltVideoUrl.trim())
        return "Please provide the video URL for latest trailer.";
      if (!ltDescription.trim())
        return "Please add a description for latest trailer.";
      if (!ltYear) return "Please enter year for latest trailer.";
      const badDirector = ltDirectorImages.find(
        (d) => d && (!d.name || !d.name.trim())
      );
      if (badDirector) return "Please add a name for every director image.";
      const badProducer = ltProducerImages.find(
        (d) => d && (!d.name || !d.name.trim())
      );
      if (badProducer) return "Please add a name for every producer image.";
      const badSinger = ltSingerImages.find(
        (d) => d && (!d.name || !d.name.trim())
      );
      if (badSinger) return "Please add a name for every singer image.";
      return null;
    }

    if (!movieName.trim()) return "Please enter movie name.";
    if (movieType !== "releaseSoon" && !poster)
      return "Please add a poster image.";
    if (movieType !== "releaseSoon") {
      if (!categories.length) return "Please choose at least one category.";
    }

    if (movieType === "normal" || movieType === "featured") {
      if (
        Number.isNaN(Number(standardSeatPrice)) ||
        Number(standardSeatPrice) <= 0
      )
        return "Please enter a valid standard seat price.";
      if (
        Number.isNaN(Number(reclinerSeatPrice)) ||
        Number(reclinerSeatPrice) <= 0
      )
        return "Please enter a valid recliner seat price.";

      const finalAuditorium =
        auditorium === "Other" ? (customAuditorium || "").trim() : auditorium;
      if (!finalAuditorium) return "Please select auditorium.";
    }

    if (movieType === "normal" || movieType === "featured") {
      const badCast = castImages.find((c) => {
        if (!c) return false;
        return !c.name || !c.name.trim() || !c.role || !c.role.trim();
      });
      if (badCast) return "Please add name and role for every cast image.";
      const badDirector = directorImages.find(
        (d) => d && (!d.name || !d.name.trim())
      );
      if (badDirector) return "Please add a name for every director image.";
      const badProducer = producerImages.find(
        (p) => p && (!p.name || !p.name.trim())
      );
      if (badProducer) return "Please add a name for every producer image.";
    }

    return null;
  }

  // Helper: append multiple files under same field name
  function appendFilesToForm(form, fieldName, items) {
    if (!items || items.length === 0) return;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it && it.file) form.append(fieldName, it.file);
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    setIsUploading(true);
    const formData = new FormData();

    formData.append("type", movieType);

    //if the movietype === latesttrailers then it willcreate a latesttrailersOBJ
    if (movieType === "latestTrailers") {
      const latestTrailerObj = {
        title: movieName,
        genres: categories,
        duration: {
          hours: Number(ltDurationHours) || 0,
          minutes: Number(ltDurationMinutes) || 0,
        },
        year: Number(ltYear) || new Date().getFullYear(),
        rating: Number(rating) || 0,
        description: ltDescription,
        thumbnail: ltThumbnail,
        videoId: ltVideoUrl,
        directors: ltDirectorImages.map((d) => ({
          name: d.name || "",
          file: d.file ? d.file.name : null,
        })),
        producers: ltProducerImages.map((p) => ({
          name: p.name || "",
          file: p.file ? p.file.name : null,
        })),
        singers: ltSingerImages.map((s) => ({
          name: s.name || "",
          file: s.file ? s.file.name : null,
        })),
      };

      formData.append("movieName", movieName);
      formData.append("latestTrailer", JSON.stringify(latestTrailerObj));

      if (ltThumbnail) formData.append("ltThumbnail", ltThumbnail);

      appendFilesToForm(formData, "ltDirectorFiles", ltDirectorImages);
      appendFilesToForm(formData, "ltProducerFiles", ltProducerImages);
      appendFilesToForm(formData, "ltSingerFiles", ltSingerImages);
    } else {
      // normal / featured / releaseSoon
      formData.append("movieName", movieName);
      formData.append("categories", JSON.stringify(categories));
      if (poster) formData.append("poster", poster);
      formData.append("trailerUrl", trailerUrl || "");
      formData.append("videoUrl", videoUrl || "");
      formData.append("rating", String(rating));
      formData.append("duration", String(duration));
      formData.append("slots", JSON.stringify(slots));
      formData.append(
        "seatPrices",
        JSON.stringify({
          standard: Number(standardSeatPrice),
          recliner: Number(reclinerSeatPrice),
        })
      );
      formData.append(
        "mrpSeatPrices",
        JSON.stringify({
          standard: Number(mrpStandardPrice) || 0,
          recliner: Number(mrpReclinerPrice)  || 0,
        })
      );
      formData.append(
        "discountBanner",
        JSON.stringify({
          enabled:   bannerEnabled,
          title:     bannerTitle,
          subtitle:  bannerSubtitle,
          bgColor:   bannerBgColor,
          textColor: bannerTextColor,
          badgeText: bannerBadge,
          expiresAt: bannerExpiry || null,
        })
      );

      const finalAuditorium =
        auditorium === "Other"
          ? customAuditorium.trim() || "Audi 1"
          : auditorium;
      formData.append("auditorium", finalAuditorium);

      formData.append(
        "cast",
        JSON.stringify(
          castImages.map((c) => ({
            name: c.name || "",
            role: c.role || "",
            file: c.file ? c.file.name : null,
          }))
        )
      );
      formData.append(
        "directors",
        JSON.stringify(
          directorImages.map((d) => ({
            name: d.name || "",
            file: d.file ? d.file.name : null,
          }))
        )
      );
      formData.append(
        "producers",
        JSON.stringify(
          producerImages.map((p) => ({
            name: p.name || "",
            file: p.file ? p.file.name : null,
          }))
        )
      );
      formData.append("story", story || "");

      appendFilesToForm(formData, "castFiles", castImages);
      appendFilesToForm(formData, "directorFiles", directorImages);
      appendFilesToForm(formData, "producerFiles", producerImages);
    }

    try {
      const resp = await axios.post(`${API_HOST}/api/movies`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (resp?.data?.sucess) {
        toast.success('Movie added sucessfully !');
        resetForm();
      }
      else {
        toast.error(resp?.data?.message || 'Unexpected error from server')
      }
    }
    catch (err) {
      console.error("Submit error:", err);
      const msg = err?.response?.data?.message || err.message || "Failed to upload.";
      toast.error(msg);

    }
    finally {
      setIsUploading(false)
    }
  }


  return (
    <div className={addMoviePageStyles.pageContainer}>
      <style>{addMoviePageCustomStyles}</style>


      <div className={addMoviePageStyles.mainContainer}>
        <header className={addMoviePageStyles.header}>
          <h1
            className={`${addMoviePageStyles.title} font-cinzel`}
          >
            <Film className={addMoviePageStyles.titleIcon} /> Add Movie
          </h1>
        </header>

        <form onSubmit={handleSubmit} className={addMoviePageStyles.form}>
          {/* Movie Type radios */}
          <div className={addMoviePageStyles.radioContainer}>
            <label className={addMoviePageStyles.radioLabel}>
              <input
                type="radio"
                name="movieType"
                checked={movieType === "normal"}
                onChange={() => setMovieType("normal")}
                className={addMoviePageStyles.radioInput}
              />
              <span>Normal</span>
            </label>
            <label className={addMoviePageStyles.radioLabel}>
              <input
                type="radio"
                name="movieType"
                checked={movieType === "featured"}
                onChange={() => setMovieType("featured")}
                className={addMoviePageStyles.radioInput}
              />
              <span>Featured</span>
            </label>
            <label className={addMoviePageStyles.radioLabel}>
              <input
                type="radio"
                name="movieType"
                checked={movieType === "releaseSoon"}
                onChange={() => setMovieType("releaseSoon")}
                className={addMoviePageStyles.radioInput}
              />
              <span>Coming Soon</span>
            </label>
            <label className={addMoviePageStyles.radioLabel}>
              <input
                type="radio"
                name="movieType"
                checked={movieType === "latestTrailers"}
                onChange={() => setMovieType("latestTrailers")}
                className={addMoviePageStyles.radioInput}
              />
              <span>Latest Trailers</span>
            </label>
          </div>

          {/* ---------- LATEST TRAILERS ---------- */}
          {movieType === "latestTrailers" && (
            <section className={addMoviePageStyles.section}>
              <div className={addMoviePageStyles.sectionGrid}>
                <div className={addMoviePageStyles.inputContainer}>
                  <label className={addMoviePageStyles.label}>Title</label>
                  <input
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    className={addMoviePageStyles.input}
                    placeholder="Trailer title"
                  />
                </div>

                <div className={addMoviePageStyles.inputContainer}>
                  <label className={addMoviePageStyles.label}>
                    Genre (choose one or more)
                  </label>
                  <div className={addMoviePageStyles.categoryContainer}>
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`${addMoviePageStyles.categoryButton} ${categories.includes(cat)
                            ? addMoviePageStyles.categoryButtonSelected
                            : addMoviePageStyles.categoryButtonNormal
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={addMoviePageStyles.durationContainer}>
                  <div>
                    <label className={addMoviePageStyles.label}>
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      value={ltDurationHours}
                      min={0}
                      onChange={(e) =>
                        setLtDurationHours(Number(e.target.value) || 0)
                      }
                      className={addMoviePageStyles.durationInput}
                    />
                  </div>
                  <div>
                    <label className={addMoviePageStyles.label}>
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={ltDurationMinutes}
                      min={0}
                      max={59}
                      onChange={(e) =>
                        setLtDurationMinutes(Number(e.target.value) || 0)
                      }
                      className={addMoviePageStyles.durationInput}
                    />
                  </div>
                  <div>
                    <label className={addMoviePageStyles.label}>Year</label>
                    <input
                      type="number"
                      value={ltYear}
                      onChange={(e) =>
                        setLtYear(
                          Number(e.target.value) || new Date().getFullYear()
                        )
                      }
                      className={addMoviePageStyles.durationInput}
                    />
                  </div>
                </div>

                <div className={addMoviePageStyles.gridCols2}>
                  <label className={addMoviePageStyles.label}>Description</label>
                  <textarea
                    value={ltDescription}
                    onChange={(e) => setLtDescription(e.target.value)}
                    rows={4}
                    className={addMoviePageStyles.textarea}
                    placeholder="Short description..."
                  ></textarea>
                </div>

                <div>
                  <label className={addMoviePageStyles.label}>Thumbnail Image</label>
                  <div className={addMoviePageStyles.uploadContainer}>
                    {ltThumbnailPreview ? (
                      <div className={addMoviePageStyles.previewContainer}>
                        <img
                          src={ltThumbnailPreview}
                          alt="thumb"
                          className={addMoviePageStyles.previewThumbnail}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLtThumbnail(null);
                            setLtThumbnailPreview(null);
                          }}
                          className={addMoviePageStyles.removeButton}
                        >
                          <X className={addMoviePageStyles.removeIcon} />
                        </button>
                      </div>
                    ) : (
                      <label className={addMoviePageStyles.uploadContent}>
                        <div className={addMoviePageStyles.uploadIconContainer}>
                          <ImageIcon className={addMoviePageStyles.uploadIcon} />
                        </div>
                        <div className={addMoviePageStyles.uploadText}>
                          Click to upload thumbnail
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLtThumbnailChange}
                          className={addMoviePageStyles.uploadInput}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className={addMoviePageStyles.label}>Video URL</label>
                  <input
                    value={ltVideoUrl}
                    onChange={(e) => setLtVideoUrl(e.target.value)}
                    className={addMoviePageStyles.input}
                    placeholder="https:// (YouTube/Vimeo URL)"
                  />
                </div>

                <div className={addMoviePageStyles.gridCols2Md3}>
                  <NamedUploader
                    title="Director Images"
                    onFiles={(e) =>
                      handleMultipleNamedFiles(e, setLtDirectorImages)
                    }
                    items={ltDirectorImages}
                    remove={(i) => removePreview(i, setLtDirectorImages)}
                    updateName={(i, v) =>
                      updateNamedItemName(i, setLtDirectorImages, v)
                    }
                    icon={<ImageIcon />}
                  />
                  <NamedUploader
                    title="Producer Images"
                    onFiles={(e) =>
                      handleMultipleNamedFiles(e, setLtProducerImages)
                    }
                    items={ltProducerImages}
                    remove={(i) => removePreview(i, setLtProducerImages)}
                    updateName={(i, v) =>
                      updateNamedItemName(i, setLtProducerImages, v)
                    }
                    icon={<Upload />}
                  />
                  <NamedUploader
                    title="Singer Images"
                    onFiles={(e) =>
                      handleMultipleNamedFiles(e, setLtSingerImages)
                    }
                    items={ltSingerImages}
                    remove={(i) => removePreview(i, setLtSingerImages)}
                    updateName={(i, v) =>
                      updateNamedItemName(i, setLtSingerImages, v)
                    }
                    icon={<Users />}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ---------- ORIGINAL MOVIE FORM ---------- */}
          {movieType !== "latestTrailers" && (
            <>
              <div className={addMoviePageStyles.gridCols3}>
                <div className="md:col-span-1">
                  <label className={addMoviePageStyles.label}>Poster Image</label>
                  <div className={addMoviePageStyles.uploadContainer}>
                    {posterPreview ? (
                      <div className={addMoviePageStyles.previewContainer}>
                        <img
                          src={posterPreview}
                          alt="poster"
                          className={addMoviePageStyles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPoster(null);
                            setPosterPreview(null);
                          }}
                          className={addMoviePageStyles.removeButton}
                          title="Remove"
                        >
                          <X className={addMoviePageStyles.removeIcon} />
                        </button>
                      </div>
                    ) : (
                      <label className={addMoviePageStyles.uploadContent}>
                        <div className={addMoviePageStyles.uploadIconContainer}>
                          <ImageIcon className={addMoviePageStyles.uploadIcon} />
                        </div>
                        <div className={addMoviePageStyles.uploadText}>
                          Click to upload poster
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePosterChange}
                          className={addMoviePageStyles.uploadInput}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className={addMoviePageStyles.inputContainer}>
                    <label className={addMoviePageStyles.label}>Movie Name</label>
                    <input
                      value={movieName}
                      onChange={(e) => setMovieName(e.target.value)}
                      className={addMoviePageStyles.input}
                      placeholder="Enter movie title"
                    />
                  </div>

                  <div className={addMoviePageStyles.inputContainer}>
                    <label className={addMoviePageStyles.label}>Categories</label>
                    <div className={addMoviePageStyles.categoryContainer}>
                      {availableCategories.map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`${addMoviePageStyles.categoryButton} ${categories.includes(cat)
                              ? addMoviePageStyles.categoryButtonSelected
                              : addMoviePageStyles.categoryButtonNormal
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(movieType === "normal" || movieType === "featured") && (
                    <>
                    {/* ── Selling Price + MRP grid ─────────────────────────── */}
                    <div className={addMoviePageStyles.gridCols3}>
                      <div>
                        <label className={addMoviePageStyles.label}>
                          Standard Seat Price — Selling Price (required)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={standardSeatPrice}
                          onChange={(e) => setStandardSeatPrice(e.target.value)}
                          placeholder="e.g. 150.00"
                          className={addMoviePageStyles.input}
                        />
                      </div>
                      <div>
                        <label className={addMoviePageStyles.label}>
                          Standard Seat MRP (optional — shown as strikethrough)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={mrpStandardPrice}
                          onChange={(e) => setMrpStandardPrice(e.target.value)}
                          placeholder="e.g. 200.00"
                          className={addMoviePageStyles.input}
                        />
                      </div>
                      <div>
                        <label className={addMoviePageStyles.label}>
                          Recliner Seat Price — Selling Price (required)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={reclinerSeatPrice}
                          onChange={(e) => setReclinerSeatPrice(e.target.value)}
                          placeholder="e.g. 250.00"
                          className={addMoviePageStyles.input}
                        />
                      </div>
                    </div>
                    <div className={addMoviePageStyles.gridCols3}>
                      <div>
                        <label className={addMoviePageStyles.label}>
                          Recliner Seat MRP (optional — shown as strikethrough)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={mrpReclinerPrice}
                          onChange={(e) => setMrpReclinerPrice(e.target.value)}
                          placeholder="e.g. 350.00"
                          className={addMoviePageStyles.input}
                        />
                      </div>

                      {/* AUDITORIUM SELECTOR */}
                      <div>
                        <label className={addMoviePageStyles.label}>Auditorium</label>
                        <select
                          value={auditorium}
                          onChange={(e) => setAuditorium(e.target.value)}
                          className={addMoviePageStyles.select}
                        >
                          {availableAuditoriums.map((a) => (
                            <option value={a} key={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* ── Festival / Discount Banner Section ───────────────── */}
                    <div style={{ border: "1px solid #374151", borderRadius: "12px", padding: "20px", marginTop: "16px", background: "#111827" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "18px", fontWeight: "700", color: "#f9fafb" }}>🎉 Festival / Discount Banner</span>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", marginLeft: "auto" }}>
                          <input
                            type="checkbox"
                            checked={bannerEnabled}
                            onChange={(e) => setBannerEnabled(e.target.checked)}
                            style={{ width: "18px", height: "18px", accentColor: "#f97316" }}
                          />
                          <span style={{ color: "#d1d5db", fontSize: "14px" }}>Enable Banner</span>
                        </label>
                      </div>
                      {bannerEnabled && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label className={addMoviePageStyles.label}>Banner Title (e.g. "Diwali Offer 🎆")</label>
                            <input
                              type="text"
                              value={bannerTitle}
                              onChange={(e) => setBannerTitle(e.target.value)}
                              placeholder="Diwali Offer 🎆"
                              className={addMoviePageStyles.input}
                            />
                          </div>
                          <div>
                            <label className={addMoviePageStyles.label}>Subtitle (e.g. "Flat 20% off on all bookings")</label>
                            <input
                              type="text"
                              value={bannerSubtitle}
                              onChange={(e) => setBannerSubtitle(e.target.value)}
                              placeholder="Flat 20% off on all bookings"
                              className={addMoviePageStyles.input}
                            />
                          </div>
                          <div>
                            <label className={addMoviePageStyles.label}>Badge Text (e.g. "LIMITED TIME")</label>
                            <input
                              type="text"
                              value={bannerBadge}
                              onChange={(e) => setBannerBadge(e.target.value)}
                              placeholder="LIMITED TIME"
                              className={addMoviePageStyles.input}
                            />
                          </div>
                          <div>
                            <label className={addMoviePageStyles.label}>Expires At (optional)</label>
                            <input
                              type="datetime-local"
                              value={bannerExpiry}
                              onChange={(e) => setBannerExpiry(e.target.value)}
                              className={addMoviePageStyles.input}
                            />
                          </div>
                          <div>
                            <label className={addMoviePageStyles.label}>Background Color</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <input
                                type="color"
                                value={bannerBgColor}
                                onChange={(e) => setBannerBgColor(e.target.value)}
                                style={{ width: "44px", height: "36px", border: "none", borderRadius: "6px", cursor: "pointer", padding: "2px" }}
                              />
                              <input
                                type="text"
                                value={bannerBgColor}
                                onChange={(e) => setBannerBgColor(e.target.value)}
                                placeholder="#FF6B00"
                                className={addMoviePageStyles.input}
                                style={{ flex: 1 }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className={addMoviePageStyles.label}>Text Color</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <input
                                type="color"
                                value={bannerTextColor}
                                onChange={(e) => setBannerTextColor(e.target.value)}
                                style={{ width: "44px", height: "36px", border: "none", borderRadius: "6px", cursor: "pointer", padding: "2px" }}
                              />
                              <input
                                type="text"
                                value={bannerTextColor}
                                onChange={(e) => setBannerTextColor(e.target.value)}
                                placeholder="#FFFFFF"
                                className={addMoviePageStyles.input}
                                style={{ flex: 1 }}
                              />
                            </div>
                          </div>
                          {/* Live Preview */}
                          <div style={{ gridColumn: "1 / -1" }}>
                            <label className={addMoviePageStyles.label}>Preview</label>
                            <div style={{ backgroundColor: bannerBgColor, color: bannerTextColor, padding: "10px 18px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                              {bannerBadge && (
                                <span style={{ backgroundColor: bannerTextColor, color: bannerBgColor, fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                  {bannerBadge}
                                </span>
                              )}
                              <span style={{ fontWeight: "700", fontSize: "14px" }}>{bannerTitle || "Banner Title"}</span>
                              {bannerSubtitle && <span style={{ fontSize: "13px", opacity: 0.9 }}>— {bannerSubtitle}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    </>
                  )}

                  {movieType !== "releaseSoon" && (
                    <div className={addMoviePageStyles.gridCols2}>
                      <div>
                        <label className={addMoviePageStyles.label}>
                          Trailer URL
                        </label>
                        <div className="flex items-center gap-2">
                          <Play />
                          <input
                            value={trailerUrl}
                            onChange={(e) => setTrailerUrl(e.target.value)}
                            placeholder="https://"
                            className={addMoviePageStyles.input}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={addMoviePageStyles.label}>Rating</label>
                        <div className="flex items-center gap-3">
                          <Star />
                          <input
                            type="number"
                            value={rating}
                            step="0.1"
                            min="0"
                            max="10"
                            onChange={(e) => setRating(Number(e.target.value))}
                            className={addMoviePageStyles.numberInput}
                          />
                        </div>
                      </div>

                      {(movieType === "normal" || movieType === "featured") && (
                        <>
                          <div>
                            <label className={addMoviePageStyles.label}>
                              Duration (hours)
                            </label>
                            <div className="flex items-center gap-3">
                              <Clock />
                              <input
                                type="number"
                                value={durationHours}
                                min={0}
                                onChange={(e) =>
                                  setDurationHours(Number(e.target.value) || 0)
                                }
                                className={addMoviePageStyles.numberInput}
                              />
                            </div>
                          </div>
                          <div>
                            <label className={addMoviePageStyles.label}>
                              Duration (minutes)
                            </label>
                            <div className="flex items-center gap-3">
                              <Clock />
                              <input
                                type="number"
                                value={durationMinutes}
                                min={0}
                                max={59}
                                onChange={(e) => {
                                  let v = Number(e.target.value);
                                  if (Number.isNaN(v)) v = 0;
                                  if (v < 0) v = 0;
                                  if (v > 59) v = 59;
                                  setDurationMinutes(v);
                                }}
                                className={addMoviePageStyles.numberInput}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {movieType !== "normal" &&
                        movieType !== "featured" &&
                        movieType !== "releaseSoon" && (
                          <div>
                            <label className={addMoviePageStyles.label}>
                              Duration (minutes)
                            </label>
                            <div className="flex items-center gap-3">
                              <Clock />
                              <input
                                type="number"
                                value={duration}
                                min={1}
                                onChange={(e) => {
                                  const v = Number(e.target.value) || 0;
                                  setDuration(v);
                                  setDurationHours(Math.floor(v / 60));
                                  setDurationMinutes(v % 60);
                                }}
                                className={addMoviePageStyles.numberInput}
                              />
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* Slots */}
              {movieType !== "releaseSoon" && (
                <section className={addMoviePageStyles.section}>
                  <div className={addMoviePageStyles.slotsHeader}>
                    <h3 className={addMoviePageStyles.sectionTitle}>Movie Slots</h3>
                    <button
                      type="button"
                      onClick={addSlot}
                      className={addMoviePageStyles.addSlotButton}
                    >
                      <Plus className={addMoviePageStyles.addSlotIcon} /> Add Slot
                    </button>
                  </div>

                  <div className="space-y-3">
                    {slots.map((slot, idx) => (
                      <div
                        key={slot.id}
                        className={addMoviePageStyles.slotItem}
                      >
                        <div className={addMoviePageStyles.slotGrid}>
                          <input
                            type="date"
                            value={slot.date}
                            onChange={(e) =>
                              updateSlot(slot.id, "date", e.target.value)
                            }
                            className={addMoviePageStyles.slotInput}
                          />
                          <input
                            type="time"
                            value={slot.time}
                            onChange={(e) =>
                              updateSlot(slot.id, "time", e.target.value)
                            }
                            className={addMoviePageStyles.slotInput}
                          />
                          <select
                            value={slot.ampm}
                            onChange={(e) =>
                              updateSlot(slot.id, "ampm", e.target.value)
                            }
                            className={addMoviePageStyles.slotInput}
                          >
                            <option>AM</option>
                            <option>PM</option>
                          </select>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => removeSlot(slot.id)}
                            className={addMoviePageStyles.slotRemoveButton}
                          >
                            <X />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Cast / Directors / Producers uploads */}
              {movieType !== "releaseSoon" && (
                <div className={addMoviePageStyles.gridCols3}>
                  <Uploader
                    title="Cast Photos"
                    onFiles={(e) =>
                      handleMultipleFiles(e, setCastImages, "nameRole")
                    }
                    items={castImages}
                    remove={(i) => removePreview(i, setCastImages)}
                    updateMeta={(i, field, v) =>
                      updateMetaField(i, setCastImages, field, v)
                    }
                    icon={<Users />}
                  />
                  <Uploader
                    title="Director Photos"
                    onFiles={(e) =>
                      handleMultipleFiles(e, setDirectorImages, "name")
                    }
                    items={directorImages}
                    remove={(i) => removePreview(i, setDirectorImages)}
                    updateMeta={(i, field, v) =>
                      updateMetaField(i, setDirectorImages, field, v)
                    }
                    icon={<ImageIcon />}
                  />
                  <Uploader
                    title="Producer Photos"
                    onFiles={(e) =>
                      handleMultipleFiles(e, setProducerImages, "name")
                    }
                    items={producerImages}
                    remove={(i) => removePreview(i, setProducerImages)}
                    updateMeta={(i, field, v) =>
                      updateMetaField(i, setProducerImages, field, v)
                    }
                    icon={<Upload />}
                  />
                </div>
              )}

              {movieType !== "releaseSoon" && (
                <div className={addMoviePageStyles.inputContainer}>
                  <label className={addMoviePageStyles.label}>Story</label>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    rows={6}
                    className={addMoviePageStyles.textarea}
                    placeholder="Write the movie story here..."
                  ></textarea>
                </div>
              )}
            </>
          )}

          <div className={addMoviePageStyles.actionsContainer}>
            <button
              type="button"
              onClick={resetForm}
              className={addMoviePageStyles.resetButton}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={addMoviePageStyles.submitButton}
            >
              {isUploading ? "Uploading..." : "Add"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position='top-right' />
    </div>
  )
};

//UPLOADER FUNCTION
function Uploader({ title, onFiles, items, remove, icon, updateMeta }) {
  return (
    <div className={addMoviePageStyles.uploaderContainer}>
      <div className={addMoviePageStyles.uploaderHeader}>
        <div className={addMoviePageStyles.uploaderTitle}>
          {icon}


          <h4 className={addMoviePageStyles.uploaderTitleText}> {title}</h4>
        </div>
        <label className={addMoviePageStyles.uploaderAddButton}>
          +Add
          <input
            type='file'
            multiple
            accept='images/*'
            onChange={onFiles}
            className={addMoviePageStyles.uploaderAddInput}
          />

        </label>

      </div>
      <div className={addMoviePageStyles.uploaderGrid}>
        {items && items.length ? (
          items.map((it, idx) => (
            <div key={idx} className={addMoviePageStyles.uploaderItem} >
              <img src={it.preview} alt="preview" className={addMoviePageStyles.uploaderItemImage} />
              <button type='button' onClick={() => remove(idx)} className={addMoviePageStyles.uploaderItemRemove}>
                <X className={addMoviePageStyles.uploaderItemRemoveIcon} />
              </button>

              {typeof it.name != 'undefined' && (
                <div className='mt-2'>
                  <input type={it.name} onChange={(e) =>
                    updateMeta && updateMeta(idx, "name", e.target.value)

                  } placeholder='Name' className={addMoviePageStyles.uploaderItemInput} />
                </div>
              )}




              {typeof it.role != 'undefined' && (
                <div className='mt-2'>
                  <input type={it.role} onChange={(e) =>
                    updateMeta && updateMeta(idx, "role", e.target.value)

                  } placeholder='Role' className={addMoviePageStyles.uploaderItemInput} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={addMoviePageStyles.uploaderEmpty}>
            No images added
          </div>
        )}
      </div>
    </div>

  );
}
//for latestTrailer we  NamedUploader

function NamedUploader({ title, onFiles, items, remove, updateName, icon }) {
  return (
    <div className={addMoviePageStyles.uploadContainer}>
      <div className={addMoviePageStyles.uploaderHeader}>
        <div className={addMoviePageStyles.uploaderTitle}>
          {icon}


          <h4 className={addMoviePageStyles.uploaderTitleText}> {title}</h4>
        </div>
        <label className={addMoviePageStyles.uploaderAddButton}>
          +Add
          <input
            type='file'
            multiple
            accept='images/*'
            onChange={onFiles}
            className={addMoviePageStyles.uploaderAddInput}
          />

        </label>

      </div>

      <div className={addMoviePageStyles.namedUploaderGrid}>

        {items && items.length ? (
          items.map((it, idx) => (
            <div key={idx} className={addMoviePageStyles.namedUploaderItem} >
              <img src={it.preview} alt="preview" className={addMoviePageStyles.namedUploaderImageuploaderItemImage}
              />
              <div className='flex-1'>
                <input value={it.name}
                  onChange={(e) => updateName(idx, e.target.value)}
                  placeholder='Name'
                  className={addMoviePageStyles.namedUploaderInput}
                />

                <div className={addMoviePageStyles.namedUploaderFileName}>
                  File :{it.file?.name}
                </div>
              </div>

              <button
                type='button'
                onClick={() => remove(idx)}
                className={addMoviePageStyles.uploaderItemRemove}
              >
                <X className={addMoviePageStyles.uploaderItemRemoveIcon} />
              </button>
            </div>

          ))
        ) : (
          <div className={addMoviePageStyles.uploaderEmpty}>
            No images added
          </div>
        )}
      </div>
    </div>
  )
}
// }

export default AddPage