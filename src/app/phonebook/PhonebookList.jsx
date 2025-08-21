"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPhonebooks } from "@/redux/phonebookSlice";
import PhonebookItem from "./PhonebookItem.jsx";
import { ArrowUpDown, UserPlus, PlusCircle } from "lucide-react";

export default function PhonebookList() {
    const dispatch = useDispatch();
    const { items, error, pagination } = useSelector((state) => state.phonebook);

    const [keyword, setKeyword] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadMoreRef = useRef(null);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(
                getPhonebooks({
                    keyword: "",
                    sortAsc: true,
                    append: false,
                    page: 1,
                    limit: pagination.limit,
                })
            );
        }
    }, [items.length, pagination.limit, dispatch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(
                getPhonebooks({
                    keyword,
                    sortAsc,
                    append: false,
                    page: 1,
                    limit: pagination.limit,
                })
            );
        }, 400);

        return () => clearTimeout(handler);
    }, [keyword, sortAsc, pagination.limit, dispatch]);

    useEffect(() => {
        if (!loadMoreRef.current || !pagination.hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setLoadingMore(true);
                    dispatch(
                        getPhonebooks({
                            keyword,
                            sortAsc,
                            append: true,
                            page: pagination.page + 1,
                            limit: pagination.limit,
                        })
                    ).finally(() => setLoadingMore(false));
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [pagination, keyword, sortAsc, loadingMore, dispatch]);

    // 🔹 Error state
    if (error)
        return <p className="text-red-600 text-center py-8">{error}</p>;

    return (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4">
            {/* Toolbar */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b py-3 mb-4 flex gap-3">
                <button
                    onClick={() => setSortAsc((prev) => !prev)}
                    className="flex items-center justify-center p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    <ArrowUpDown
                        className={`transition-transform duration-300 ${sortAsc ? "rotate-0" : "rotate-180"
                            }`}
                    />
                </button>

                <input
                    type="search"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Cari kontak..."
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />

                <a
                    href="/add"
                    className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    <UserPlus />
                </a>
            </div>

            {/* List */}
            {items.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-3">
                        {keyword.trim()
                            ? `Tidak ada kontak dengan "${keyword.trim()}"`
                            : "Belum ada kontak"}
                    </p>
                    <a
                        href="/add"
                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        <PlusCircle className="mr-2" />
                        Tambah Kontak {keyword.trim() ? "" : "Pertama"}
                    </a>
                </div>
            ) : (
                <>
                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 overflow-hidden">
                        {items.map((pb) => (
                            <PhonebookItem key={pb.id} phonebook={pb} />
                        ))}
                    </div>

                    {/* Infinite Scroll trigger */}
                    <div ref={loadMoreRef} style={{ height: 1, visibility: "hidden" }} />

                    {loadingMore && (
                        <p className="text-center py-4 text-gray-500 text-sm">
                            Loading more...
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
