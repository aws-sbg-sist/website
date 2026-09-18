import type { CoreMember } from "../types";

interface CoreMemberCardProps {
  member: CoreMember;
  onSelect?: () => void;
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
  onSelect,
}: CoreMemberCardProps) {
  return (
    <article className="core-member-card">
      <div className="core-member-card__topline">
        <span className="core-member-card__team">
          {member.teamName}
        </span>

        <span
          className="core-member-card__status"
          aria-label="Active core team member"
        />
      </div>

      <div className="core-member-card__identity">
        {member.photoUrl ? (
          <img
            className="core-member-card__avatar"
            src={member.photoUrl}
            alt={`${member.name} profile`}
          />
        ) : (
          <div
            className="core-member-card__avatar core-member-card__avatar--placeholder"
            aria-hidden="true"
          >
            {getInitials(member.name)}
          </div>
        )}

        <div className="core-member-card__info">
          <h2>{member.name}</h2>
          <p>{member.department}</p>
        </div>
      </div>

      <div className="core-member-card__details">
        <div>
          <span>YEAR</span>
          <strong>{member.year}</strong>
        </div>

        <div>
          <span>TEAM</span>
          <strong>{member.teamName}</strong>
        </div>
      </div>

      {member.about && (
        <p className="core-member-card__about">
          {member.about}
        </p>
      )}

      <div className="core-member-card__actions">
        {onSelect && (
          <button type="button" onClick={onSelect}>
            View Profile
          </button>
        )}

        {member.linkedinUrl && member.linkedinUrl !== "#" && (
          <a
            className="core-member-card__linkedin"
            href={member.linkedinUrl}
            target="_blank"
            rel="noreferrer"
          >
            View LinkedIn →
          </a>
        )}
      </div>
    </article>
  );
}
