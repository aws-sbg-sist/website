import React from "react";
import { ProjectCard } from "./components/ProjectCard";
import {
  mockProjects,
  mockAchievements,
  mockAlumniTeams,
} from "./data/mockData";

export const LegacyModule: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Projects Showcase
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Achievements
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mockAchievements.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {item.year}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Alumni & Previous Teams
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mockAlumniTeams.map((team) => (
            <div
              key={team.id}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Academic Year {team.academicYear}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
                {team.teamName}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Members: {team.members.join(", ")}
              </p>
              {team.note && (
                <p className="mt-2 text-xs italic text-neutral-500">
                  {team.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export * from "./types";
export * from "./components/ProjectCard";
