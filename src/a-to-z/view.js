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

    const departments = [
        "Academic Appeals",
        "Academic Calendars",
        "Academic Inclusive Initiatives",
        "Academic Success Center",
        "Access and Engagement at the College of Communication and Information",
        "Access and Engagement at the College of Education, Health, and Human Sciences",
        "Access and Engagement at the Herbert College of Agriculture",
        "Access and Engagement, Division of",
        "Accessible Information, Materials, and Technology",
        "Accounting and Information Management, Department of",
        "Accounts Payable",
        "Admissions, Graduate",
        "Admissions, Undergraduate",
        "Adult Learning in Professional Settings",
        "Advanced Microscopy and Imaging Center",
        "Advancement, Office of",
        "Advertising and Public Relations, School of",
        "Advising, Undergraduate",
    ]

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
                            {letters.map((letter, index) => (
                                <div className="a-to-z-index-alphabet-filter-letter" key={index}>
                                    <a href={`#${letter}`} className="a-to-z-index-alphabet-filter-letter-button">{letter}</a>
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
                                <div className="a-to-z-index-section-content">
                                    <ul className="a-to-z-index-section-list">
                                        {departments.map((dept, index) => (
                                            <li className="a-to-z-index-section-list-item">
                                                <a href="#">{dept}</a>
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