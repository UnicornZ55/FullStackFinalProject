import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function normalizeBooks(docs = []) {
  return docs.map((doc, idx) => {
    const key = doc.key || "";
    const workId = key.replace("/works/", "") || `temp-${idx}`;
    return {
      id: workId,
      title: doc.title || "Untitled",
      author: doc.author_name?.[0] || "Unknown author",
      workId,
      isFavorite: false,
    };
  });
}

export default function LibraryHome() {
  const navigate = useNavigate();
  const location = useLocation();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const favoriteIdsRef = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get("https://openlibrary.org/search.json", {
          params: {
            q: "programming",
            limit: 20,
            fields: "key,title,author_name",
          },
        });

        if (!isMounted) return;

        const docs = res.data?.docs || [];
        setBooks(normalizeBooks(docs).map((book) => ({
          ...book,
          isFavorite: favoriteIdsRef.current.has(book.workId),
        })));
      } catch (err) {
        if (!isMounted) return;
        setError("Unable to load books. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const favId = location.state?.favId;
    if (!favId) return;

    favoriteIdsRef.current.add(favId);

    setBooks((prev) =>
      prev.map((book) =>
        book.workId === favId ? { ...book, isFavorite: true } : book
      )
    );

    navigate("/library", { replace: true, state: null });
  }, [location.state, navigate]);

  const emptyState = useMemo(() => !loading && books.length === 0 && !error, [loading, books, error]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-lg font-semibold">Loading books...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (emptyState) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p>No books found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Deep-Link Library Explorer</h1>
      <p className="mt-1 text-sm text-gray-500">Tap a book to view lazy-loaded details</p>

      <div className="mt-6 space-y-3">
        {books.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => navigate(`/library/${book.workId}`, { state: { book } })}
            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:shadow"
          >
            <p className="font-semibold">
              {book.title}
              {book.isFavorite ? " ❤️" : ""}
            </p>
            <p className="text-sm text-gray-600">{book.author}</p>
          </button>
        ))}
      </div>
    </main>
  );
}