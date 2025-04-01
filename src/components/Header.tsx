interface HeaderProps {
  name: string;
  title: string;
  location: string;
  email: string;
  links: { name: string; url: string }[];
}

export default function Header({ name, title, location, email, links }: HeaderProps) {
  // Handle different base paths in different environments
  const imgSrc = `/CV/resume_photo.png`;

  return (
    <header className="flex flex-col md:flex-row print:flex-row">
      <div className="w-full md:w-[250px] print:w-[250px] bg-primary relative min-h-[250px]" style={{ height: '250px' }}>
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src={imgSrc}
            alt={name} 
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover', width: '100%', height: '100%', objectPosition: 'top' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                const fallback = document.createElement('div');
                fallback.className = "w-full h-full flex items-center justify-center text-white";
                fallback.innerHTML = `<span class="text-5xl font-bold">${name.charAt(0)}</span>`;
                e.currentTarget.parentElement.appendChild(fallback);
              }
            }}
          />
        </div>
      </div>
      <div className="flex-1 p-10 flex flex-col justify-center bg-secondary">
        <h1 className="mb-2">{name}</h1>
        <h2 className="mb-6">{title}</h2>
        <div className="text-lg">
          <p>{location}</p>
          <p><a href={`mailto:${email}`}>{email}</a></p>
        </div>
      </div>
    </header>
  );
} 