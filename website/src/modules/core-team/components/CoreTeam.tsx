import { getCoreMembers } from "../data";
import type { CoreMember } from "../types";
import CoreMemberCard from "./CoreMemberCard";

export interface CoreTeamProps {
  members?: CoreMember[];
  onMemberSelect: (member: CoreMember) => void;
}

function groupMembersByTeam(members: CoreMember[]) {
  return members.reduce<Record<string, CoreMember[]>>((groups, member) => {
    const teamMembers = groups[member.teamName] ?? [];
    groups[member.teamName] = [...teamMembers, member];
    return groups;
  }, {});
}

export default function CoreTeam({
  members = getCoreMembers(),
  onMemberSelect,
}: CoreTeamProps) {
  const groupedMembers = groupMembersByTeam(members);

  return (
    <section className="core-team" aria-labelledby="core-team-title">
      <div className="core-team__content">
        <header className="core-team__header">
          <p className="core-team__eyebrow">
            AWS STUDENT BUILDERS GROUP
          </p>

          <h1 id="core-team-title">Meet the Core Team.</h1>

          <p className="core-team__intro">
            Meet the students who help lead, build, and grow our
            AWS Student Builder community.
          </p>
        </header>

        {members.length === 0 ? (
          <p role="status">No core team members are available yet.</p>
        ) : (
          <div className="core-team__groups">
            {Object.entries(groupedMembers).map(([teamName, teamMembers]) => (
              <section
                className="core-team__group"
                key={teamName}
                aria-labelledby={`core-team-group-${teamMembers[0].id}`}
              >
                <h2 id={`core-team-group-${teamMembers[0].id}`}>{teamName}</h2>

                <div className="core-team__grid">
                  {teamMembers.map((member) => (
                    <CoreMemberCard
                      key={member.id}
                      member={member}
                      onViewProfile={onMemberSelect}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
