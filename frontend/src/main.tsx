import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { App } from './App.tsx'
import { UploadCSV } from './UpladCSV.tsx';

import '@picocss/pico'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/upload",
    element: <UploadCSV />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
