interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
  projects?: string[];
}

interface EducationProps {
  education: EducationItem[];
}

export default function Education({ education }: EducationProps) {
  return (
    <section className="cv-section">
      <h2 className="section-title">Education</h2>
      <div>
        {education.map((edu, index) => (
          <div key={index}>
            <div className="mb-4">
              <h3 className="mb-1">{edu.degree}, {edu.institution}, {edu.location}</h3>
              <span className="period">{edu.period}</span>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 pr-2">
              {edu.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
            
            {edu.projects && edu.projects.length > 0 && (
              <ul className="list-disc ml-5 space-y-1.5 mt-3 pr-2">
                {edu.projects.map((project, idx) => (
                  <li key={idx}>{project}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 