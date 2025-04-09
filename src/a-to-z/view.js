import apiFetch from '@wordpress/api-fetch';
import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

export default function View() {
    const alphabetRef = useRef(null);
    const sectionRefs = useRef({});
    const [aToZItems, setAToZItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState(new URLSearchParams(window.location.search).get('search') || '');
    const [isBackToVisible, setIsBackToVisible] = useState(false);
    const [activeLetter, setActiveLetter] = useState(null);
    const [offset, setOffset] = useState(0);

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

    useEffect(() => {
        // if (!offset) return;

        if (alphabetRef.current) {
            console.log('height', alphabetRef.current.offsetHeight);
            setOffset(alphabetRef.current.offsetHeight);
        }
    
        const observerOptions = {
            root: null,
            rootMargin: `-${offset}px 0px 0px 0px`,
            threshold: 0.5,
        };
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log('entry', entry);
                if (entry.isIntersecting) {
                    const letter = entry.target.id;
                    setActiveLetter(letter);
                    console.log('letter', letter);
                }
            });
        }, observerOptions);
    
        aToZItems.forEach((item) => {
            const el = sectionRefs.current[item.letter];
            if (el) observer.observe(el);
        });
    
        return () => observer.disconnect();
      }, [aToZItems, offset]);
    
    // Show back to top element
    useEffect(() => {
        const toggleVisibility = () => {
            setIsBackToVisible(window.scrollY > 1200);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToElement = () => {
        const element = document.getElementById("alpha");
        if (element) {
            window.scrollTo({ 
                top: element.getBoundingClientRect().top + window.scrollY, 
                behavior: "smooth" 
            });
        }
    };

    const handleAlphaLink = (letter) => {
        const element = sectionRefs.current[letter];
        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY;
            window.history.pushState(null, "", `#${letter}`);
            window.scrollTo({ top: top - offset, behavior: "smooth" });
        }
    };

    const ChevronUpIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
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
                            <input className="form-control" aria-label="Search the index" id="program-search" name="search" type="search" value={searchTerm} onChange={(e) => handleFilterChange('search', e.target.value, setSearchTerm)} placeholder="Search the index" />
                            <label for="program-search">Search the index</label>
                        </div>
                    </div>
                    <div className="a-to-z-index-alphabet" ref={alphabetRef}>
                        {aToZItems.map((group) => (
                            <div className="a-to-z-index-alphabet-letter" key={group.letter}>
                                <button
                                    // href={`#${group.letter}`}
                                    className={`a-to-z-index-alphabet-letter-button ${
                                        activeLetter === group.letter && "a-to-z-index-alphabet-letter-button--active"
                                      }`}
                                    onClick={() => handleAlphaLink(group.letter)}
                                >{group.letter}</button>
                            </div>
                        ))}
                    </div>
                    <div className="a-to-z-index-sections">
                        {aToZItems.map((group) => (
                            <div key={group.letter} id={group.letter} className="a-to-z-index-section" ref={(el) => (sectionRefs.current[group.letter] = el)}>
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
                    {isBackToVisible && (
                        <button className="a-to-z-index-back-to" onClick={scrollToElement}>
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