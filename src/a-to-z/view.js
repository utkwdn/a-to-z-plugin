import apiFetch from '@wordpress/api-fetch';
import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

export default function View() {
    const alphabetRef = useRef(null);
    const sectionRefs = useRef({});
    const [isLoading, setIsLoading] = useState(true);
    const [aToZItems, setAToZItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState(new URLSearchParams(window.location.search).get('search') || '');
    const [isBackToVisible, setIsBackToVisible] = useState(false);
    const [activeLetter, setActiveLetter] = useState(null);
    const [isSticky, setIsSticky] = useState(false);
    const [offset, setOffset] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    // Allow 500ms for user to finish typing before performing search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Fetch data on load or whenever debouncedSearch changes
    useEffect(() => {
        fetchAToZItems(debouncedSearch);
    }, [debouncedSearch]);

    useEffect(() => {
        const hash = window.location.hash.replace("#", "").toUpperCase();
        if (aToZItems.length > 0) {
            const section = sectionRefs.current[hash]?.current;
            if (section) {
                const top = section.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: top - offset, behavior: "smooth" });
            }
        }
    }, [aToZItems, offset, sectionRefs]);

    const fetchAToZItems = async (search = '') => {
        try {
            const query = search ? `?search=${encodeURIComponent(search)}&limit=100` : '?limit=100';
            const data = await apiFetch({ path: `/custom/v1/a-to-z-posts${query}` });
            setAToZItems(data);
        } catch (error) {
            console.error('Failed to fetch A to Z items:', error);
        } finally {
            setIsLoading(false);
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

    aToZItems.forEach((group) => {
        if (!sectionRefs.current[group.letter]) {
            sectionRefs.current[group.letter] = React.createRef();
        }
    });

    useEffect(() => {
        if (!alphabetRef.current) return;

        const adminBar = document.getElementById('wpadminbar');
        let adminBarOffset = 0;

        if (adminBar && window.innerWidth > 600) {
            adminBarOffset = adminBar.offsetHeight;
        }

        setOffset(alphabetRef.current.offsetHeight + adminBarOffset);

        const observerOptions = {
            root: null,
            rootMargin: `-${alphabetRef.current.offsetHeight}px 0px -60% 0px`,
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const letter = entry.target.id;
                    setActiveLetter(letter);
                }
            });
        }, observerOptions);

        aToZItems.forEach((group) => {
            const section = sectionRefs.current[group.letter].current;
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [aToZItems]);

    const scrollToElement = () => {
        const element = document.getElementById("alpha");
        if (element) {
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.scrollY,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            // Back to top visibility
            setIsBackToVisible(window.scrollY > 1200);
    
            // Sticky alphabet
            if (alphabetRef.current) {
                const adminBar = document.getElementById("wpadminbar");
                const rect = alphabetRef.current.getBoundingClientRect();
                let offset = adminBar ? adminBar.offsetHeight : 0;
    
                setIsSticky(rect.top <= offset);
            }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (letter) => {
        const section = sectionRefs.current[letter]?.current;
        if (section) {
            const top = section.getBoundingClientRect().top + window.scrollY;
            history.replaceState(null, "", window.location.pathname + window.location.search + `#${letter}`);
            window.scrollTo({ top: top - offset, behavior: "smooth" });
        }
    };

    const ChevronUpIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
            </svg>
        );
    };

    return (
        <>
            <div className="a-to-z-container-banner wp-block-block alignfull utkwds-orange-bar-texture has-orange-background-color has-background" />
            <div className="a-to-z-index-container wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
                <div className="a-to-z-index alignwide">
                    <div className="a-to-z-index-input">
                        <div class="form-floating">
                            <input className="form-control" aria-label="Search the index" id="a-to-z-search" name="search" type="search" value={searchTerm} onChange={(e) => handleFilterChange('search', e.target.value, setSearchTerm)} placeholder="Search the index" />
                            <label for="a-to-z-search">Search the index</label>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="a-to-z-index-alphabet">
                            {[...Array(20)].map(() => (
                                <div class="placeholder-glow">
                                    <span class="a-to-z-index-alphabet-letter-button placeholder"></span>
                                </div>
                            ))}
                        </div>
                    ) : aToZItems.length === 0 && !isLoading ? (
                        <></>
                    ) : (
                        <div className={`a-to-z-index-alphabet${isSticky ? " a-to-z-index-alphabet--fixed" : ""}`} ref={alphabetRef}>
                            {aToZItems.map((group) => (
                                <div className="a-to-z-index-alphabet-letter" key={group.letter}>
                                    <button
                                        // href={`#${group.letter}`}
                                        className={`a-to-z-index-alphabet-letter-button ${activeLetter === group.letter && "a-to-z-index-alphabet-letter-button--active"
                                            }`}
                                        onClick={() => scrollToSection(group.letter)}
                                    >{group.letter}</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {isLoading ? (
                        <div className="a-to-z-index-sections">
                            {[...Array(2)].map((e, i) => (
                                <div key={i} className="a-to-z-index-section">
                                    <div className="a-to-z-index-section-drop-cap">
                                        <div className="a-to-z-index-section-drop-cap-letter placeholder-glow">
                                            <span className="placeholder" style={{ width: 100 }}></span>
                                        </div>
                                    </div>
                                    <div className="a-to-z-index-section-content">
                                        <ul className="a-to-z-index-section-list">
                                            {[...Array(5)].map((e, i) => (
                                                <li key={i} className="a-to-z-index-section-list-item placeholder-glow">
                                                    <a className="placeholder placeholder-lg" style={{ width: `100%` }}></a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : aToZItems.length === 0 && !isLoading ? (
                        <div className="a-to-z-index-no-results">
                            <div className="a-to-z-index-no-results-content">
                                <h2>There are no matches for your search.</h2>
                                <p>Try searching again with different terms.</p>
                                <p class="is-style-utkwds-cta-link">
                                    <a href="https://www.utk.edu/">Search all of utk.edu</a>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="a-to-z-index-sections">
                            {aToZItems.map((group) => (
                                <div key={group.letter} id={group.letter} className="a-to-z-index-section" ref={sectionRefs.current[group.letter]}>
                                    <div className="a-to-z-index-section-drop-cap">
                                        <div className="a-to-z-index-section-drop-cap-letter">{group.letter}</div>
                                    </div>
                                    <div className="a-to-z-index-section-content">
                                        <ul className="a-to-z-index-section-list">
                                            {group.posts.map((item) => (
                                                <li key={item.ID} className="a-to-z-index-section-list-item">
                                                    <a href={item.url}>{item.title}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {isBackToVisible && (
                        <button className="a-to-z-index-back-to" onClick={scrollToElement} aria-label="Back to top" title="Back to top">
                            <ChevronUpIcon />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

const root = createRoot(document.getElementById('alpha'));
root.render(<View />);