import { useState } from "react";

const PROJECTS = [
  {
    name: "Tipo A",
    detail: "2 dormitorios",
    note: "Planta tipo, orientación norte",
    tone: "sand",
  },
  {
    name: "Tipo B",
    detail: "3 dormitorios",
    note: "Estar en doble altura",
    tone: "sage",
  },
  {
    name: "Planta baja",
    detail: "Local comercial",
    note: "Frente a la calle",
    tone: "slate",
  },
];

const METHOD = [
  {
    index: "01",
    title: "Planos",
    text: "Wireframes y diseño UI/UX en React. Planificar cómo se verá y cómo funcionará.",
  },
  {
    index: "02",
    title: "Cimientos",
    text: "Node.js, PostgreSQL y AWS. La estructura invisible que sostiene todo.",
  },
  {
    index: "03",
    title: "Estructura",
    text: "Frontend en React. Lo que le da forma a la aplicación.",
  },
];

function skipIntro() {
  return new URLSearchParams(window.location.search).get("intro") === "0";
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !skipIntro());

  return (
    <div className="page">
      <section className="home" id="inicio">
        <header className="nav">
          <a className="logo" href="#inicio">Obra</a>
          <nav className="nav-links" aria-label="Secciones">
            <a href="#metodo">Método</a>
            <a href="#proyectos">Proyectos</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </header>

        <div className="home-grid">
          <div className="hero-copy">
            <p className="eyebrow">Propuesta de desarrollo</p>
            <h1>Como una buena obra.</h1>
            <p className="lede">Así se construye una buena aplicación.</p>
            <a className="btn" href="#proyectos">Ver proyectos</a>
          </div>

          <aside className="preview" aria-label="Vista de la aplicación">
            <div className="preview-bar">
              <span>Obra</span>
              <span>Proyectos · Unidades</span>
            </div>
            <div className="preview-body">
              <Facade />
              <div className="preview-copy">
                <p className="eyebrow dark">En obra</p>
                <h2>Próximas unidades.</h2>
                <ul>
                  {PROJECTS.map((project) => (
                    <li key={project.name}>
                      <span>{project.name}</span>
                      {project.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <div className="method-bar">
          {METHOD.map((item) => (
            <a key={item.index} href="#metodo">
              <span>{item.index}</span>
              <strong>{item.title}</strong>
              <em>
                {item.index === "02"
                  ? "Node.js · PostgreSQL · AWS"
                  : item.index === "01"
                    ? "UI/UX · React"
                    : "Frontend · React"}
              </em>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="metodo">
        <div className="section-head">
          <p className="eyebrow">Método</p>
          <h2>Misma rigurosidad. Distinto material.</h2>
        </div>
        <div className="cards">
          {METHOD.map((item) => (
            <article key={item.index}>
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="proyectos">
        <div className="section-head">
          <p className="eyebrow">Proyectos</p>
          <h2>Unidades en construcción.</h2>
        </div>
        <div className="projects">
          {PROJECTS.map((project) => (
            <article key={project.name} className={project.tone}>
              <div className="swatch" />
              <h3>{project.name}</h3>
              <p>{project.detail}</p>
              <small>{project.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact" id="contacto">
        <div className="section-head">
          <p className="eyebrow">Contacto</p>
          <h2>Conversemos la obra.</h2>
        </div>
        <ContactForm />
      </section>

      <footer className="footer">
        <span>Obra</span>
        <span>Propuesta de desarrollo</span>
      </footer>

      {showIntro && <Intro onDone={() => setShowIntro(false)} />}
    </div>
  );
}

function Facade() {
  return (
    <div className="facade" aria-hidden="true">
      <div className="facade-windows">
        {Array.from({ length: 12 }, (_, i) => <span key={i} />)}
      </div>
      <div className="facade-base">
        <i />
      </div>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="thanks" role="status">
        Recibimos tu mensaje. Te respondemos a la brevedad.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label>
        Nombre
        <input name="nombre" autoComplete="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Mensaje
        <textarea name="mensaje" rows="4" required />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
}

function Intro({ onDone }) {
  return (
    <div className="intro">
      <video
        src="/video/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onDone}
        onError={onDone}
      />
      <button type="button" onClick={onDone}>Saltar</button>
    </div>
  );
}
