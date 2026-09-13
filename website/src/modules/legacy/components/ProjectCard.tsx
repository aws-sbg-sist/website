import React from "react";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.summary}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div
            className="mt-4 flex flex-wrap gap-1.5"
            aria-label="Technologies used"
          >
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {project.links && project.links.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
            >
              {link.label}
              <span aria-hidden="true" className="ml-1">
                ↗
              </span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
};
