import { useState } from "react";
import type { CoreMember } from "../types";

export interface CoreMemberCardProps {
  member: CoreMember;
  onViewProfile: (member: CoreMember) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CoreMemberCard({
  member,
  onViewProfile,
}: CoreMemberCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <article className="core-member-card">
      <div className="core-member-card__topline">
        <span className="core-member-card__team">{member.teamName}</span>
        <span
          className="core-member-card__status"
          aria-hidden="true"
        />
      </div>

      <div className="core-member-card__identity">
        {member.photoUrl && !hasImageError ? (
          <img
            className="core-member-card__avatar"
            src={member.photoUrl}
            alt={`Profile photo of ${member.name}`}
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div
            className="core-member-card__avatar core-member-card__avatar--placeholder"
            role="img"
            aria-label={`Profile photo unavailable for ${member.name}`}
          >
            {getInitials(member.name)}
          </div>
        )}

        <div className="core-member-card__info">
          <h3>{member.name}</h3>
          <p>{member.department}</p>
        </div>
      </div>

      <dl className="core-member-card__details">
        <div>
          <dt>Year</dt>
          <dd>{member.year}</dd>
        </div>
        <div>
          <dt>Team</dt>
          <dd>{member.teamName}</dd>
        </div>
      </dl>

      {member.about && (
        <p className="core-member-card__about">{member.about}</p>
      )}

      <div className="core-member-card__actions">
        <button type="button" onClick={() => onViewProfile(member)}>
          View profile
        </button>

        {member.linkedinUrl && (
          <a
            className="core-member-card__linkedin"
            href={member.linkedinUrl}
            target="_blank"
            rel="noreferrer"
          >
            View LinkedIn profile (external)
          </a>
        )}
      </div>
    </article>
  );
}
