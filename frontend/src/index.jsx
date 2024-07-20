import React from "react";
import App from "./App";
import Context from "./Context";
// import * as serviceWorker from "./serviceWorker"
import { createRoot } from 'react-dom/client';

const Application = (
    <Context>
        <App/>
    </Context>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(Application);

// serviceWorker.unregister()
