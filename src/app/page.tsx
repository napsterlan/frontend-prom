import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'

const WelcomeComponent = () => {
    return (
      <div className="welcome-section">
        <h2>Привет!</h2>
        <p>Это мой новый компонент</p>
      </div>
    )
  }
export default function Home() {
    return (
<>
    <WelcomeComponent />
</>
    )
  }