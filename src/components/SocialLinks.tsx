interface SocialLinksProps {
  links: { name: string; url: string }[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="cv-section">
      <div className="flex items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="inline mr-2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span className="inline-block">
          {links.map((link, index) => (
            <span key={link.name} className="inline-block">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap"
              >
                {link.name}
              </a>
              {index !== links.length - 1 && <span className="mr-1">,</span>}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
} 