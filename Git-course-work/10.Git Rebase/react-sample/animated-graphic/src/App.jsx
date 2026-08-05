import Orrery from './components/Orrery.jsx'
import Spacecraft from './components/Spacecraft.jsx'

export default function App() {
  return (
    <main className="stage">
      <Orrery />
      <Spacecraft />
      <div className="caption">
        <span className="caption__eyebrow">ORR&nbsp;·&nbsp;01</span>
        <span className="caption__title">a quiet orrery Rebase B</span>
      </div>
    </main>
  )
}
