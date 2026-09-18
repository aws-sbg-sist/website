import type { CoreMember } from "../types";

interface CoreMemberProfileProps {
  member: CoreMember;
  onBack?: () => void;
}

export default function CoreMemberProfile({
  member,
  onBack,
}: CoreMemberProfileProps) {
  return (
    <article className="core-member-profile">
      {onBack && (
        <button type="button" onClick={onBack}>
          ← Back to Core Team
        </button>
      )}

      <div className="core-member-profile__header">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={`${member.name} profile`}
          />
        ) : (
          <div aria-hidden="true">
            {member.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}

        <div>
          <p>{member.teamName}</p>
          <h1 id="core-member-profile-title">{member.name}</h1>
          <p>{member.department}</p>
          <p>{member.year}</p>
        </div>
      </div>

      {member.teamAbout && (
        <section>
          <h2>About the Team</h2>
          <p>{member.teamAbout}</p>
        </section>
      )}

      {member.about && (
        <section>
          <h2>About</h2>
          <p>{member.about}</p>
        </section>
      )}

      {member.linkedinUrl && member.linkedinUrl !== "#" && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn →
        </a>
      )}
    </article>
  );
}
