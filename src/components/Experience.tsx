interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies?: string[];
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

export default function Experience({ experiences }: ExperienceProps) {
  return (
    <section className="cv-section">
      <h2 className="section-title mb-8">Employment History</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="subsection">
            <div className="flex flex-col mb-4">
              <h3 className="mb-1">{exp.title}, {exp.company}, {exp.location}</h3>
              <span className="period">{exp.period}</span>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 pr-2">
              {exp.description.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {exp.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs rounded-md bg-gray-100 text-text-secondary">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 