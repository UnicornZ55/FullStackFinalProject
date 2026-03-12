import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function readDescription(payload) {
  const raw = payload?.description;
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && typeof raw.value === "string") {
    return raw.value;
  }
  return "No description available.";
}

export default function LibraryDetails() {
  const { workId: workIdFromPath } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const book = location.state?.book;
  const workId = workIdFromPath || book?.workId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!workId) {
      setLoading(false);
      setError("Missing work id.");
      return;
    }

    let isMounted = true;

    const fetchDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`https://openlibrary.org/works/${workId}.json`);
        if (!isMounted) return;
        setDetails(res.data);
      } catch (err) {
        if (!isMounted) return;
        setError("Unable to load book details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [workId]);

  const title = useMemo(() => book?.title || details?.title || "Book Details", [book, details]);
  const author = useMemo(() => book?.author || "Unknown author", [book]);
  const description = useMemo(() => readDescription(details), [details]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="rounded border border-gray-300 px-3 py-1 text-sm"
      >
        Back
      </button>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-gray-600">{author}</p>

        {loading && <p className="mt-5 font-medium">Loading...</p>}

        {!loading && error && <p className="mt-5 text-red-600">{error}</p>}

        {!loading && !error && (
          <p className="mt-5 whitespace-pre-wrap text-gray-800">{description}</p>
        )}

        <button
          type="button"
          onClick={() => navigate("/library", { state: { favId: workId } })}
          className="mt-6 rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
        >
          Mark as Favorite
        </button>
      </section>
    </main>
  );
}