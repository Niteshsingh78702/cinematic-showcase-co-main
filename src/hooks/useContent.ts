import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');

export interface ContentItem {
    id: number;
    section: string;
    title: string | null;
    description: string | null;
    media_url: string | null;
    media_type: string | null;
    link_url: string | null;
    category: string | null;
    display_order: number;
    is_active: boolean;
}

/**
 * Fetch content items from the backend API by section.
 * Returns items array, loading state, and error.
 */
export function useContent(section: string) {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/content?section=${section}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setItems(data);
            } catch (err: any) {
                console.warn(`Content fetch failed for "${section}":`, err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [section]);

    return { items, loading, error };
}

/**
 * Fetch content from multiple sections at once.
 */
export function useMultiContent(sections: string[]) {
    const [data, setData] = useState<Record<string, ContentItem[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const results: Record<string, ContentItem[]> = {};
                await Promise.all(
                    sections.map(async (section) => {
                        try {
                            const res = await fetch(`${API_URL}/api/content?section=${section}`);
                            if (res.ok) {
                                results[section] = await res.json();
                            } else {
                                results[section] = [];
                            }
                        } catch {
                            results[section] = [];
                        }
                    })
                );
                setData(results);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [sections.join(",")]);

    return { data, loading };
}

export default useContent;
