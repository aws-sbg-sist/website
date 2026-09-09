import { useMemo, useState } from "react";
import { membersDirectoryContent } from "../data/mockData";
import "../MembersDirectory.css";

const allTeamsLabel = "All Members";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MembersDirectory() {
  const [activeTeam, setActiveTeam] = useState(allTeamsLabel);
  const teams = useMemo(
    () =>
      Array.from(
        new Set(
          membersDirectoryContent.members.map((member) => member.teamName),
        ),
      ),
    [],
  );
  const filteredMembers = useMemo(
    () =>
      activeTeam === allTeamsLabel
        ? membersDirectoryContent.members
        : membersDirectoryContent.members.filter(
            (member) => member.teamName === activeTeam,
          ),
    [activeTeam],
  );

  return (
    <section className="members-directory" aria-labelledby="members-title">
      <div className="members-directory__ambient" aria-hidden="true" />
      <div className="members-directory__content">
        <header className="members-directory__header">
          <div>
            <p className="members-directory__eyebrow">
              AWS STUDENT BUILDERS GROUP
            </p>
            <h1 id="members-title">Meet the builders.</h1>
            <p className="members-directory__intro">
              Explore the people shaping our community through craft, curiosity,
              and collaboration.
            </p>
          </div>
          <div
            className="members-directory__count"
            aria-label={`${filteredMembers.length} members shown`}
          >
            <span>{String(filteredMembers.length).padStart(2, "0")}</span>
            <small>members shown</small>
          </div>
        </header>

        <nav
          className="members-directory__filters"
          aria-label="Filter members by team"
        >
          <span className="members-directory__filter-label">
            FILTER BY TEAM
          </span>
          <div className="members-directory__filter-list">
            {[allTeamsLabel, ...teams].map((team) => {
              const isActive = activeTeam === team;

              return (
                <button
                  key={team}
                  type="button"
                  className={`members-directory__filter ${isActive ? "members-directory__filter--active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveTeam(team)}
                >
                  {team}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="members-directory__results" aria-live="polite">
          Showing <strong>{filteredMembers.length}</strong>{" "}
          {filteredMembers.length === 1 ? "member" : "members"}
          {activeTeam !== allTeamsLabel && <span> in {activeTeam}</span>}
        </div>

        <div className="members-directory__grid">
          {filteredMembers.map((member) => (
            <article className="member-card" key={member.id}>
              <div className="member-card__topline">
                <span className="member-card__index">
                  /{member.id.replace("member-", "")}
                </span>
                <span
                  className="member-card__status"
                  aria-label="Active member"
                />
              </div>
              <div className="member-card__identity">
                {member.photoUrl ? (
                  <img
                    className="member-card__avatar"
                    src={member.photoUrl}
                    alt={`${member.name} profile`}
                  />
                ) : (
                  <div
                    className="member-card__avatar member-card__avatar--placeholder"
                    aria-hidden="true"
                  >
                    {getInitials(member.name)}
                  </div>
                )}
                <div>
                  <h2>{member.name}</h2>
                  <p>{member.department}</p>
                </div>
              </div>
              <div className="member-card__details">
                <div>
                  <span>YEAR</span>
                  <strong>{member.year}</strong>
                </div>
                <div>
                  <span>TEAM</span>
                  <strong>{member.teamName}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
