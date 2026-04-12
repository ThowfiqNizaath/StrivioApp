import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {SnackbarProvider} from "notistack"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SnackbarProvider maxSnack={3} anchorOrigin={{
      vertical:"top",
      horizontal: "right"
    }} autoHideDuration={2000}>
      <App />
    </SnackbarProvider>
  </BrowserRouter>,
);
