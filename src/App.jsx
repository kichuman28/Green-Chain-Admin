import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Web3Provider } from './context/Web3Context'
import { Toaster } from 'react-hot-toast'
import { router } from './routes'

function App() {
  return (
    <Web3Provider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </Web3Provider>
  )
}

export default App
