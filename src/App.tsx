import { Tex } from './components/Tex';
import { ui } from './content/en/ui';

export function App() {
  return (
    <main className="page">
      <header>
        <h1>{ui.appName}</h1>
        <p className="tagline">{ui.tagline}</p>
        <p className="status">{ui.status}</p>
      </header>

      <section aria-labelledby="core-idea">
        <h2 id="core-idea">{ui.coreIdea.heading}</h2>
        <p>{ui.coreIdea.body}</p>
        <Tex math={ui.coreIdea.math} display />
      </section>

      <section aria-labelledby="labs">
        <h2 id="labs">{ui.labs.heading}</h2>
        <ul className="lab-list">
          {ui.labs.items.map((lab) => (
            <li key={lab.id}>
              <h3>{lab.title}</h3>
              <p>{lab.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
