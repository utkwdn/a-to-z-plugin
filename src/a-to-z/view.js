import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

export default function View() {
    const [searchTerm, setSearchTerm] = useState(new URLSearchParams(window.location.search).get('search') || '');

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

    const letters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ#');

    return (
        <>
            <div className="wp-block-block alignfull utkwds-orange-bar-texture has-orange-background-color has-background" />
            <div className="a-to-z-index-container wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
                <div className="a-to-z-index alignwide">
                    <div className="a-to-z-index-filters">
                        <div class="form-floating">
                            <input className="form-control" aria-label="Search the index" id="program-search" name="search" type="search" value={searchTerm} onChange={(e) => handleFilterChange('search', e.target.value, setSearchTerm)} placeholder="Search the index" />
                            <label for="program-search">Search the index</label>
                        </div>
                        <div className="a-to-z-index-alphabet-filter">
                            {letters.map((letter, index) => (
                                <div className="a-to-z-index-alphabet-filter-letter" key={index}>
                                    <button href={letter} className="a-to-z-index-alphabet-filter-letter-button">{letter}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="a-to-z-index-sections">
                        {letters.map((letter, index) => (
                            <div id={letter} className="a-to-z-index-section" key={index}>
                                <div className="a-to-z-index-section-drop-cap">
                                    <div className="a-to-z-index-section-drop-cap-letter">{letter}</div>
                                </div>
                                <div className="a-to-z-index-section-list">
                                    <ul>
                                        {Array.from({ length: 25 }, () =>
                                            <li>{Math.random().toString(36).substring(2, 10)}</li>
                                        )}
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