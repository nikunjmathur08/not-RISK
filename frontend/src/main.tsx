import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReactLenis } from '@studio-freight/react-lenis'

createRoot(document.getElementById('root')!).render(
    <ReactLenis
      root
      className='overflow-x-hidden w-screen'
      options={{
        syncTouch: false,
        smoothWheel: true,
        wheelMultiplier: 1,
        gestureOrientation: "vertical",
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      }}
    >
    <App />
    </ReactLenis>
)
