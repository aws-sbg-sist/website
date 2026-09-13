import { useEffect, useMemo, useState } from "react";
import { membersDirectoryContent } from "../data/mockData";
import type { Member } from "../types";
import "../MembersDirectory.css";

const allTeamsLabel = "All Members";
type MembersDirectoryStatus = "loading" | "ready" | "empty" | "error";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function loadMembers(): Promise<Member[]> {
  return Promise.resolve(membersDirectoryContent.members);
}

export default function MembersDirectory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTeam, setActiveTeam] = useState(allTeamsLabel);
  const [status, setStatus] = useState<MembersDirectoryStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadDirectory = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await loadMembers();
      setMembers(data);
      setStatus(data.length === 0 ? "empty" : "ready");
    } catch (error) {
      setMembers([]);
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load the member directory right now.",
      );
    }
  };

  useEffect(() => {
    void loadDirectory();
  }, []);

  const teams = useMemo(
    () => Array.from(new Set(members.map((member) => member.teamName))),
    [members],
  );

  const filteredMembers = useMemo(
    () =>
      activeTeam === allTeamsLabel
        ? members
        : members.filter((member) => member.teamName === activeTeam),
    [activeTeam, members],
  );

  const showNoResultsState = status === "ready" && filteredMembers.length === 0;

  const renderMemberCard = (member: Member) => (
    <article className="member-card" key={member.id}>
      <div className="member-card__topline">
        <span className="member-card__index">
          /{member.id.replace("member-", "")}
        </span>
        <span className="member-card__status" aria-label="Active member" />
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
              const isDisabled = status !== "ready";

              return (
                <button
                  key={team}
                  type="button"
                  className={`members-directory__filter ${isActive ? "members-directory__filter--active" : ""}`}
                  aria-pressed={isActive}
                  disabled={isDisabled}
                  onClick={() => setActiveTeam(team)}
                >
                  {team}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="members-directory__results" aria-live="polite">
          {status === "loading" ? (
            <span>Loading members directory...</span>
          ) : (
            <>
              Showing <strong>{filteredMembers.length}</strong>{" "}
              {filteredMembers.length === 1 ? "member" : "members"}
              {activeTeam !== allTeamsLabel && <span> in {activeTeam}</span>}
            </>
          )}
        </div>

        {status === "loading" && (
          <div className="members-directory__state-grid" aria-live="polite">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="member-card member-card--loading"
                aria-hidden="true"
              >
                <div className="member-card__skeleton member-card__skeleton--line short" />
                <div className="member-card__identity member-card__identity--loading">
                  <div className="member-card__skeleton member-card__skeleton--avatar" />
                  <div className="member-card__skeleton-group">
                    <div className="member-card__skeleton member-card__skeleton--line" />
                    <div className="member-card__skeleton member-card__skeleton--line small" />
                  </div>
                </div>
                <div className="member-card__details member-card__details--loading">
                  <div className="member-card__skeleton member-card__skeleton--line tiny" />
                  <div className="member-card__skeleton member-card__skeleton--line tiny" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="members-directory__state" role="alert">
            <div className="members-directory__state-card">
              <p className="members-directory__state-eyebrow">SYSTEM STATUS</p>
              <h2>Unable to load directory</h2>
              <p>
                {errorMessage ||
                  "The member directory is temporarily unavailable."}
              </p>
              <button
                type="button"
                className="members-directory__retry"
                onClick={() => void loadDirectory()}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {status === "empty" && (
          <div className="members-directory__state" role="status">
            <div className="members-directory__state-card">
              <p className="members-directory__state-eyebrow">
                DIRECTORY STATUS
              </p>
              <h2>No members available</h2>
              <p>
                The roster is currently empty. This is ready for future mock or
                API-driven data.
              </p>
            </div>
          </div>
        )}

        {showNoResultsState && (
          <div className="members-directory__state" role="status">
            <div className="members-directory__state-card">
              <p className="members-directory__state-eyebrow">FILTER RESULT</p>
              <h2>No members in {activeTeam}</h2>
              <p>Try another team or view everyone in the directory.</p>
              <button
                type="button"
                className="members-directory__retry"
                onClick={() => setActiveTeam(allTeamsLabel)}
              >
                View all members
              </button>
            </div>
          </div>
        )}

        {status === "ready" && filteredMembers.length > 0 && (
          <div className="members-directory__grid">
            {filteredMembers.map(renderMemberCard)}
          </div>
        )}
      </div>
    </section>
  );
}
