import { useState } from "react";
import type { CoreMember } from "../types";

export interface CoreMemberProfileProps {
  member: CoreMember;
  onBack?: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CoreMemberProfile({
  member,
  onBack,
}: CoreMemberProfileProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <article
      className="core-member-profile"
      aria-labelledby="core-member-profile-title"
    >
      {onBack && (
        <button type="button" onClick={onBack}>
          Back to Core Team
        </button>
      )}

      <div className="core-member-profile__header">
        {member.photoUrl && !hasImageError ? (
          <img
            src={member.photoUrl}
            alt={`Profile photo of ${member.name}`}
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div
            role="img"
            aria-label={`Profile photo unavailable for ${member.name}`}
          >
            {getInitials(member.name)}
          </div>
        )}

        <div>
          <p>{member.teamName}</p>
          <h1 id="core-member-profile-title">{member.name}</h1>
          <p>{member.department}</p>
          <p>{member.year}</p>
        </div>
      </div>

      <section>
        <h2>About the Team</h2>
        <p>{member.teamAbout || "Team information is not available yet."}</p>
      </section>

      <section>
        <h2>About the Member</h2>
        <p>{member.about || "A member biography is not available yet."}</p>
      </section>

      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noreferrer"
        >
          View LinkedIn profile (external)
        </a>
      )}
    </article>
  );
}
