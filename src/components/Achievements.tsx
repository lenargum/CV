interface Achievement {
  title: string;
  details: string;
  subDetails?: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  return (
    <section className="cv-section achievements-section">
      <h2 className="section-title">Achievements</h2>
      <div className="space-y-4 pr-2">
        {achievements.map((achievement, index) => (
          <div key={index} className="mb-4 achievement-item">
            <h3 className="mb-1">{achievement.title}</h3>
            <p>{achievement.details}</p>
            {achievement.subDetails && (
              <p className="subtle-text mt-1">• {achievement.subDetails}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 