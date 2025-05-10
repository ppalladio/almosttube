'use client';
import { Button } from '@/components/ui/button';
import { APP_URL } from '@/lib/constants';
import { SearchIcon, XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const [value, setValue] = useState(query);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url = new URL('/search', APP_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        const newQuery = value.trim();
        if (categoryId) {
            url.searchParams.set('categoryId', categoryId);
        }
        if (newQuery) {
            url.searchParams.set('query', encodeURIComponent(newQuery));
        } else {
            url.searchParams.delete('query');
        }
        setValue(newQuery);
        // @ts-expect-error static typed router error
        router.push(url.toString());
    };
    return (
        <form action="submit" className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
            <div className="relative w-full">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="text"
                    placeholder="Search"
                    className="w-full pl-4 py-2 pr-12 rounded-l-full focus:outline-none focus:border-blue-300 border"
                />
                {value && (
                    <Button
                        type={`button`}
                        variant="ghost"
                        size="icon"
                        onClick={() => setValue('')}
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full"
                    >
                        <XIcon className="text-gray-500" />
                    </Button>
                )}
            </div>
            <button
                disabled={!value.trim()}
                type="submit"
                className="px-5 py-2.5 bg-gray-100 border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SearchIcon className="size-5" />
            </button>
        </form>
    );
};
export default SearchInput;
