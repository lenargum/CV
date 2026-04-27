// Header.jsx — avatar + name/title + plain icon-with-text social row (no fisheye).
function Header({ data, lang, profile }) {
  const info = data.personalInfo;
  const name = info.name && info.name[lang] ? info.name[lang] : info.name;
  const title = info.title[lang];

  return (
    <header className="cv-header">
      <div className="cv-header__avatar">
        <img src="../../assets/resume_photo.png" alt={typeof name === 'string' ? name : ''} />
      </div>
      <div className="cv-header__body">
        <div className="cv-header__top">
          <div className="cv-header__heading">
            <h1 className="cv-name">{name}</h1>
            <div className="cv-title">{title}</div>
          </div>
          <div className="cv-header__profile">
            <ProfileSwitcher profile={profile} />
          </div>
        </div>
        <div className="cv-header__socials">
          <a className="cv-social" href={`mailto:${info.email}`}>
            <SocialIcon type="email" />
            <span>{info.email}</span>
          </a>
          {info.links.map((l) => (
            <a key={l.name} className="cv-social cv-social--icon" href={l.url} target="_blank" rel="noreferrer" title={l.displayText} aria-label={l.displayText}>
              <SocialIcon type={l.icon} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

window.Header = Header;
