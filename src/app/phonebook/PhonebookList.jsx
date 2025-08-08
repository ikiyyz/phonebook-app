'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPhonebooks } from '@/redux/phonebookSlice';
import PhonebookItem from './PhonebookItem.jsx';
import { ArrowUpAZ, ArrowDownAZ, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PhonebookList() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { items = [], loading, error, page = 1, pages = 1, search: keyword, sortAsc } = useSelector((state) => state.phonebook);
    const [search, setSearch] = useState(keyword || '');
    const [loadingMore, setLoadingMore] = useState(false);
    const loadMoreRef = useRef(null);

    // Debounced search
    const searchRef = useRef(search);
    useEffect(() => { searchRef.current = search; }, [search]);
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchRef.current === search) {
                dispatch(getPhonebooks({ page: 1, search, sortAsc: !sortAsc }));
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [dispatch, search, sortAsc]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (loading || loadingMore) return;
        if (page >= pages) return;
        const observer = new window.IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && !loadingMore && page < pages) {
                    setLoadingMore(true);
                    dispatch(getPhonebooks({ 
                        page: page + 1, 
                        search, 
                        sortAsc: !sortAsc, 
                        append: true 
                    }))
                    .finally(() => setLoadingMore(false));
                }
            },
            { root: null, rootMargin: "0px", threshold: 1.0 }
        );
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [dispatch, page, pages, loading, loadingMore, search, sortAsc]);

    if (loading && page === 1) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => dispatch(getPhonebooks({ page: 1, search, sortAsc: !sortAsc }))}
                >
                    {sortAsc ? <ArrowUpAZ /> : <ArrowDownAZ />}
                </button>
                <input
                    type="search"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => router.push('/add')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" />
                    Add Contact
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                {items.map((contact) => (
                    <PhonebookItem key={contact.id} contact={contact} />
                ))}
            </div>
            <div ref={loadMoreRef} style={{ height: 1 }} />
            {loadingMore && (
                <div className="flex justify-center my-4">
                    <span className="px-4 py-2 bg-gray-200 rounded">Loading more...</span>
                </div>
            )}
        </div>
    );
}
