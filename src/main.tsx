import ReactDOM from 'react-dom/client'
import React from "react"
import { BrowserRouter as Router } from 'react-router-dom'
import "animate.css"
import "./reset.css"
import "./hover.css"
import App from "./App"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Router>
        <App />
    </Router>
)
