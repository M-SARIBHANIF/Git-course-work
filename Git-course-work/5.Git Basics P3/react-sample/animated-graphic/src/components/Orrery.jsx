import { useEffect, useRef } from 'react'

// Each ring: radius, vertical squash (tilt) to fake perspective, angular
// speed (sign = direction), stroke width, and rgb colors for the ring
// line / traveling body.
const RINGS = [
  { radius: 90, tilt: 0.32, speed: 0.35, width: 1, color: '203, 161, 82', dot: '244, 233, 216', dash: [] },
  { radius: 140, tilt: 0.42, speed: -0.22, width: 1, color: '90, 140, 130', dot: '178, 214, 205', dash: [2, 6] },
  { radius: 190, tilt: 0.5, speed: 0.15, width: 1, color: '181, 101, 29', dot: '235, 176, 118', dash: [] },
  { radius: 235, tilt: 0.56, speed: -0.09, width: 1, color: '203, 161, 82', dot: '244, 233, 216', dash: [1, 5] },
]

const TRAIL_LENGTH = 14

export default function Orrery() {
  const canvasRef = useRef(null)
  const trailsRef = useRef(RINGS.map(() => []))
  const dustRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf
    let width, height, cx, cy

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = width / 2
      cy = height / 2

      const count = Math.floor((width * height) / 9000)
      dustRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.35 + 0.05,
      }))
    }

    resize()
    window.addEventListener('resize', resize)

    function drawDust() {
      dustRef.current.forEach((d) => {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(244, 233, 216, ${d.a})`
        ctx.fill()
      })
    }

    function drawSun(t) {
      const pulse = 1 + Math.sin(t * 0.9) * 0.08
      const r = 13 * pulse

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4)
      grad.addColorStop(0, 'rgba(244, 233, 216, 0.9)')
      grad.addColorStop(0.35, 'rgba(203, 161, 82, 0.35)')
      grad.addColorStop(1, 'rgba(203, 161, 82, 0)')
      ctx.beginPath()
      ctx.arc(cx, cy, r * 4, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = '#F4E9D8'
      ctx.shadowColor = 'rgba(244, 233, 216, 0.8)'
      ctx.shadowBlur = 18
      ctx.fill()
      ctx.shadowBlur = 0
    }

    function drawRing(ring, t, index) {
      const ry = ring.radius * ring.tilt

      ctx.save()
      ctx.beginPath()
      ctx.ellipse(cx, cy, ring.radius, ry, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${ring.color}, 0.28)`
      ctx.lineWidth = ring.width
      if (ring.dash.length) ctx.setLineDash(ring.dash)
      ctx.stroke()
      ctx.restore()

      const angle = t * ring.speed + index * 1.7
      const x = cx + Math.cos(angle) * ring.radius
      const y = cy + Math.sin(angle) * ry

      const trail = trailsRef.current[index]
      trail.push({ x, y })
      if (trail.length > TRAIL_LENGTH) trail.shift()

      trail.forEach((p, i) => {
        const a = (i / trail.length) * 0.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ring.dot}, ${a})`
        ctx.fill()
      })

      ctx.beginPath()
      ctx.arc(x, y, 2.6, 0, Math.PI * 2)
      ctx.fillStyle = `rgb(${ring.dot})`
      ctx.shadowColor = `rgba(${ring.dot}, 0.9)`
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0
    }

    function frame(now) {
      const t = now * 0.001
      ctx.clearRect(0, 0, width, height)
      drawDust()
      RINGS.forEach((ring, i) => drawRing(ring, t, i))
      drawSun(t)
      if (!reduceMotion) raf = requestAnimationFrame(frame)
    }

    if (reduceMotion) {
      frame(0)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="orrery-canvas" />
}
