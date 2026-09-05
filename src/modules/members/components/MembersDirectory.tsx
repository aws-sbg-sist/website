import { membersDirectoryContent } from "../data/mockData";

export default function MembersDirectory() {
  return (
    <section>
      <h1>Members Directory</h1>

      <p>AWS Student Builders Group - Team Members</p>

      <div>
        {membersDirectoryContent.members.map((member) => (
          <article key={member.id}>
            <h3>{member.name}</h3>
            <p>
              <strong>Team:</strong> {member.team}
            </p>
            <p>
              <strong>Department:</strong> {member.department}
            </p>
            <p>
              <strong>Year:</strong> {member.year}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
