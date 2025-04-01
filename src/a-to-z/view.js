import React from 'react';
import { createRoot } from 'react-dom/client';

export default function View() {
    return (
        <>
            <p>A to Z Block</p>
        </>
    );
}

const root = createRoot(document.getElementById('alpha'));
root.render(<View />);