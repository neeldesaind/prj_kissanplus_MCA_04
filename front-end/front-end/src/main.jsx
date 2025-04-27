import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DarkModeProvider } from './Components/Context/DarkModeContext'
import router from './Components/Routes/Routes'

import { RouterProvider } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <DarkModeProvider>
      <RouterProvider router={router}/>
    </DarkModeProvider>
   
  </StrictMode>
 )
