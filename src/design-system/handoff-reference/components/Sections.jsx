// Sections.jsx — Summary / KeySkills / Experience / Education / Awards / Teaching
function pickL(v, lang) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return v[lang] ?? v.en ?? "";
}

function fmtDate(d, lang) {
  if (!d) return "";
  const months = lang === "ru"
    ? ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"]
    : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function DateRange({ start, end, lang, t }) {
  return (
    <span className="cv-daterange">
      {start ? fmtDate(start, lang) : ""} — {end ? fmtDate(end, lang) : t.present}
    </span>
  );
}

function MarkdownLite({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>{parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <React.Fragment key={i}>{p}</React.Fragment>
    )}</span>
  );
}

function SectionTitle({ children }) {
  return <h2 className="cv-section__title">{children}</h2>;
}

function Summary({ data, lang, t }) {
  const lines = pickL(data.summary, lang).split("\n");
  return (
    <section className="cv-section">
      <SectionTitle>{t.summary}</SectionTitle>
      <div className="cv-summary">
        {lines.map((l, i) => <p key={i}>{l}</p>)}
      </div>
    </section>
  );
}

function KeySkills({ data, lang, t }) {
  return (
    <section className="cv-section">
      <SectionTitle>{t.skills}</SectionTitle>
      <div className="cv-skills">
        {data.skillGroups.map((g, gi) => (
          <div className="cv-skillgroup" key={gi}>
            <div className="cv-skillgroup__name">{pickL(g.name, lang)}</div>
            <div className="cv-tag-row">
              {g.tags.map((tag) => <Tag key={tag} tag={tag} profile="all" />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceItem({ exp, lang, t }) {
  return (
    <article className="cv-exp">
      <div className="cv-exp__head">
        <img className="cv-exp__icon" src={exp.icon} alt="" />
        <div className="cv-exp__heading">
          <div className="cv-exp__company">{pickL(exp.company, lang)}</div>
          <div className="cv-exp__title">{pickL(exp.title, lang)}</div>
        </div>
        <div className="cv-exp__meta">
          <DateRange start={exp.dateStart} end={exp.dateEnd} lang={lang} t={t} />
          <div className="cv-exp__loc">{pickL(exp.location, lang)}</div>
        </div>
      </div>
      <ul className="cv-exp__bullets">
        {pickL(exp.bullets, lang).map((b, i) => <li key={i}><MarkdownLite text={b} /></li>)}
      </ul>
      {exp.tags && (
        <div className="cv-tag-row cv-exp__tags">
          {exp.tags.map((tag) => <Tag key={tag} tag={tag} profile="all" />)}
        </div>
      )}
    </article>
  );
}

function Experience({ data, lang, t }) {
  return (
    <section className="cv-section">
      <SectionTitle>{t.experience}</SectionTitle>
      <div className="cv-stack">
        {data.experiences.map((e, i) => <ExperienceItem key={i} exp={e} lang={lang} t={t} />)}
      </div>
    </section>
  );
}

function EducationItem({ edu, lang, t }) {
  return (
    <article className="cv-exp">
      <div className="cv-exp__head">
        <img className="cv-exp__icon" src={edu.icon} alt="" />
        <div className="cv-exp__heading">
          <div className="cv-exp__company">{pickL(edu.institution, lang)}</div>
          <div className="cv-exp__title">{pickL(edu.degree, lang)} · {pickL(edu.specialization, lang)}</div>
        </div>
        <div className="cv-exp__meta">
          <DateRange start={edu.dateStart} end={edu.dateEnd} lang={lang} t={t} />
        </div>
      </div>
      <ul className="cv-exp__bullets">
        {pickL(edu.highlights, lang).map((h, i) => <li key={i}>{h}</li>)}
      </ul>
    </article>
  );
}

function Education({ data, lang, t }) {
  return (
    <section className="cv-section">
      <SectionTitle>{t.education}</SectionTitle>
      <div className="cv-stack">
        {data.education.map((e, i) => <EducationItem key={i} edu={e} lang={lang} t={t} />)}
      </div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="cv-bullet-list">
      {items.map((it, i) => (
        <li key={i}>
          <MarkdownLite text={it.details} />
          {it.sub && <div className="cv-bullet-sub">{it.sub}</div>}
        </li>
      ))}
    </ul>
  );
}

function Awards({ data, lang, t }) {
  return (
    <section className="cv-section">
      <SectionTitle>{t.awards}</SectionTitle>
      <BulletList items={pickL(data.awards, lang)} />
    </section>
  );
}

function Teaching({ data, lang, t }) {
  return (
    <section className="cv-section">
      <SectionTitle>{t.teaching}</SectionTitle>
      <BulletList items={pickL(data.teaching, lang)} />
    </section>
  );
}

Object.assign(window, { Summary, KeySkills, Experience, Education, Awards, Teaching });
