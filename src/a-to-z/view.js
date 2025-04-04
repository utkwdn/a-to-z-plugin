import apiFetch from '@wordpress/api-fetch';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

export default function View() {
    const [aToZItems, setAToZItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState(new URLSearchParams(window.location.search).get('search') || '');

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

    const handleFilterChange = (key, value, setter) => {
        // Update filters for fetch and display
        setter(value);

        updateURLParams(key, value);
    };

    const updateURLParams = (key, value) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        const seperator = params.size > 0 ? '?' : '';
        window.history.replaceState({}, '', `${window.location.pathname}${seperator}${params.toString()}`);
    };

    return (
        <>
            <div className="a-to-z-container-banner wp-block-block alignfull utkwds-orange-bar-texture has-orange-background-color has-background" />
            <div className="a-to-z-index-container wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
                <div className="a-to-z-index alignwide">
                    <div className="a-to-z-index-filters">
                        <div class="form-floating">
                            <input className="form-control" aria-label="Search the index" id="program-search" name="search" type="search" value={searchTerm} onChange={(e) => handleFilterChange('search', e.target.value, setSearchTerm)} placeholder="Search the index" />
                            <label for="program-search">Search the index</label>
                        </div>
                        <div className="a-to-z-index-alphabet-filter">
                            {aToZItems.map((group) => (
                                <div className="a-to-z-index-alphabet-filter-letter" key={group.letter}>
                                    <a href={`#${group.letter}`} className="a-to-z-index-alphabet-filter-letter-button">{group.letter}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="a-to-z-index-sections">
                        {aToZItems.map((group) => (
                            <div key={group.letter} id={group.letter} className="a-to-z-index-section">
                                <div className="a-to-z-index-section-drop-cap">
                                    <div className="a-to-z-index-section-drop-cap-letter">{group.letter}</div>
                                </div>
                                <div className="a-to-z-index-section-content">
                                    <ul className="a-to-z-index-section-list">
                                        {group.posts.map((item) => (
                                            <li key={item.ID} className="a-to-z-index-section-list-item">
                                                <a href={item.url}>{item.title}</a><br />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

const root = createRoot(document.getElementById('alpha'));
root.render(<View />);