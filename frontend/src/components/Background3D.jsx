import { useEffect, useRef, useState } from 'react'

const Background3D = () => {
  const canvasRef = useRef(null)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Generate floating particles
    const newParticles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 20 + 10,
        delay: Math.random() * 20
      })
    }
    setParticles(newParticles)
  }, [])

  return (
    <div className="animated-bg">
      {/* Animated gradient background */}
      <div className="gradient-overlay" />
      
      {/* Floating particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.speed}s`,
              transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)`
            }}
          />
        ))}
      </div>

      {/* 3D floating elements */}
      <div className="floating-elements">
        <div className="floating-element element-1" />
        <div className="floating-element element-2" />
        <div className="floating-element element-3" />
        <div className="floating-element element-4" />
      </div>

      {/* Interactive gradient orbs */}
      <div className="gradient-orbs">
        <div 
          className="orb orb-1"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
          }}
        />
        <div 
          className="orb orb-2"
          style={{
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`
          }}
        />
      </div>

      <style>{`
        .gradient-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(139, 92, 246, 0.1) 0%,
            transparent 50%
          );
          pointer-events: none;
          z-index: 1;
        }

        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .floating-element {
          position: absolute;
          background: linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 50%;
          filter: blur(40px);
          animation: float 20s infinite ease-in-out;
        }

        .element-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .element-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 10%;
          animation-delay: 5s;
        }

        .element-3 {
          width: 250px;
          height: 250px;
          bottom: 10%;
          left: 30%;
          animation-delay: 10s;
        }

        .element-4 {
          width: 150px;
          height: 150px;
          top: 30%;
          right: 30%;
          animation-delay: 15s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(20px) rotate(240deg);
          }
        }

        .gradient-orbs {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.5;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent);
          top: -100px;
          left: -100px;
        }

        .orb-2 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
          bottom: -100px;
          right: -100px;
        }
      `}</style>
    </div>
  )
}

export default Background3D
