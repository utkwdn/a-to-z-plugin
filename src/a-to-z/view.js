import apiFetch from '@wordpress/api-fetch';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

export default function View() {
    const [aToZItems, setAToZItems] = useState([]);

    useEffect(() => {
        fetchAToZItems();
    }, []);

    const fetchAToZItems = async () => {
        try {
            const data = await apiFetch({ path: '/custom/v1/a-to-z-posts?limit=100' });
            setAToZItems(data);
        } catch (error) {
            console.error('Failed to fetch A to Z items:', error);
        }
    };

    return (
        <>
            <div>
                {aToZItems.map((group) => (
                    <div key={group.letter} id={group.letter}>
                        <div>
                            <h3>{group.letter}</h3>
                        </div>
                        <ul>
                            {group.posts.map((item) => (
                                <li key={item.ID}>
                                    <a href={item.url}>{item.title}</a><br />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}

const root = createRoot(document.getElementById('alpha'));
root.render(<View />);