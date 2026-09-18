import { useState } from "react";
import { coreMembers } from "../data/mockData";
import CoreMemberCard from "./CoreMemberCard";
import CoreMemberProfile from "./CoreMemberProfile";

export default function CoreTeam() {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedMember = coreMembers.find(
    (member) => member.id === selectedMemberId,
  );

  if (selectedMember) {
    return (
      <section
        className="core-team"
        aria-labelledby="core-member-profile-title"
      >
        <div className="core-team__content">
          <CoreMemberProfile
            member={selectedMember}
            onBack={() => setSelectedMemberId(null)}
          />
        </div>
      </section>
    );
  }

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

        <div className="core-team__grid" aria-label="Core team members">
          {coreMembers.map((member) => (
            <CoreMemberCard
              key={member.id}
              member={member}
              onSelect={() => setSelectedMemberId(member.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
