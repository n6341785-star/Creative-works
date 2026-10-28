import React, { useState } from 'react';
import { Project, SkillLevel, TrackType, UserProfile } from '../types';
import { guidedProjects } from '../data/projects';
import { filterProjectsForStudent } from '../utils/progress';
import {
  FolderGit2,
  CheckCircle2,
  Circle,
  Play,
  Code2,
  Sparkles,
  Clock,
  Eye,
  Check,
  Award,
} from 'lucide-react';

interface ProjectsViewProps {
  profile: UserProfile;
  onSetSkillLevel: (level: SkillLevel) => void;
  onToggleRequirement: (projectId: string, reqId: string) => void;
  onCompleteProject: (projectId: string) => void;
  onOpenProjectInPlayground: (code: Project['starterCode'], mode: 'frontend' | 'backend') => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  profile,
  onSetSkillLevel,
  onToggleRequirement,
  onCompleteProject,
  onOpenProjectInPlayground,
}) => {
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<'all' | 'frontend' | 'backend'>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [showSolutionId, setShowSolutionId] = useState<string | null>(null);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  // Filter projects by active track filter
  const filteredProjects = guidedProjects.filter(
    (p) => selectedTrackFilter === 'all' || p.trackId === selectedTrackFilter
  );

  const { recommended, others } = filterProjectsForStudent(
    filteredProjects,
    selectedTrackFilter === 'all' ? profile.activeTrack : selectedTrackFilter,
    profile.assessedLevel
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header and Skill Level Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-sky-400" />
            <span>Skill-Level Assigned Projects</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-world projects tailored to your assessed coding level. Build in the playground and track completion.
          </p>
        </div>

        {/* Skill Level Selector & Assessment */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSetSkillLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                  profile.assessedLevel === lvl
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDiagnosticModal(true)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            Placement Quiz
          </button>
        </div>
      </div>

      {/* Filter by Track (All, Frontend, Backend) */}
      <div className="flex items-center gap-2 text-xs">
        {(['all', 'frontend', 'backend'] as const).map((track) => (
          <button
            key={track}
            onClick={() => setSelectedTrackFilter(track)}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
              selectedTrackFilter === track
                ? 'bg-slate-800 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {track === 'all' ? 'All Tracks' : `${track} Projects`}
          </button>
        ))}
      </div>

      {/* Recommended for Your Level */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h2 className="text-base font-bold text-slate-100">
            Recommended for Your Level ({profile.assessedLevel})
          </h2>
        </div>

        {recommended.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No projects found matching the active filter. Try selecting "All Tracks".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommended.map((project) => renderProjectCard(project))}
          </div>
        )}
      </div>

      {/* Other Skill Levels */}
      {others.length > 0 && (
        <div className="mt-4">
          <h2 className="text-base font-bold text-slate-100 mb-3">
            Explore Other Skill Levels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {others.map((project) => renderProjectCard(project))}
          </div>
        </div>
      )}

      {/* Diagnostic Assessment Modal */}
      {showDiagnosticModal && (
        <DiagnosticQuizModal
          currentLevel={profile.assessedLevel}
          onSelectLevel={(lvl) => {
            onSetSkillLevel(lvl);
            setShowDiagnosticModal(false);
          }}
          onClose={() => setShowDiagnosticModal(false)}
        />
      )}
    </div>
  );

  function renderProjectCard(project: Project) {
    const prog = profile.projectProgress[project.id];
    const isCompleted = prog?.completed;
    const completedReqs = prog?.completedRequirements || [];
    const isExpanded = expandedProjectId === project.id;
    const isShowingSolution = showSolutionId === project.id;

    const allReqsDone = project.requirements.every((r) => completedReqs.includes(r.id));

    return (
      <div
        key={project.id}
        className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between shadow-sm transition-all"
      >
        <div>
          {/* Card Top Meta */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-2">
              <span className="capitalize font-semibold text-sky-400 font-mono">
                {project.trackId}
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{project.level}</span>
            </div>

            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>~{project.estimatedHours}h build</span>
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-1.5">{project.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{project.description}</p>

          {/* Skills Covered */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.skillsCovered.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px] font-mono"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Requirements Checklist Toggle */}
          <div className="border-t border-slate-800/80 pt-3 mb-3">
            <button
              onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-sky-300 transition-colors py-1 cursor-pointer"
            >
              <span>
                Requirements Checklist ({completedReqs.length}/{project.requirements.length})
              </span>
              <span className="text-sky-400">{isExpanded ? 'Hide' : 'View'}</span>
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2 text-xs">
                {project.requirements.map((req) => {
                  const done = completedReqs.includes(req.id);
                  return (
                    <button
                      key={req.id}
                      onClick={() => onToggleRequirement(project.id, req.id)}
                      className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0 mt-0.5" />
                      )}
                      <span className={done ? 'line-through text-slate-500' : 'text-slate-300'}>
                        {req.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={() => onOpenProjectInPlayground(project.starterCode, project.trackId)}
            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-sky-400" />
            <span>Open in Playground</span>
          </button>

          <button
            disabled={isCompleted}
            onClick={() => onCompleteProject(project.id)}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              isCompleted
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Completed (+150 XP)</span>
              </>
            ) : (
              <span>Verify & Complete</span>
            )}
          </button>
        </div>
      </div>
    );
  }
};

interface DiagnosticModalProps {
  currentLevel: SkillLevel;
  onSelectLevel: (lvl: SkillLevel) => void;
  onClose: () => void;
}

const DiagnosticQuizModal: React.FC<DiagnosticModalProps> = ({
  currentLevel,
  onSelectLevel,
  onClose,
}) => {
  const levels: { level: SkillLevel; title: string; desc: string; criteria: string }[] = [
    {
      level: 'beginner',
      title: 'Beginner Coder',
      desc: 'Starting your programming journey.',
      criteria: 'Focus on HTML semantics, Box Model, basic JavaScript variables, loops, and simple routes.',
    },
    {
      level: 'intermediate',
      title: 'Intermediate Developer',
      desc: 'Comfortable with web building blocks.',
      criteria: 'Focus on Flexbox/Grid, closures, async/await, Express REST endpoints, and CRUD operations.',
    },
    {
      level: 'advanced',
      title: 'Advanced Engineer',
      desc: 'Ready for architecture and systems.',
      criteria: 'Focus on AST parsing, JWT authentication, rate limiting, and performance optimization.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <h2 className="text-lg font-bold text-slate-100 mb-1">Select Your Skill Level</h2>
        <p className="text-xs text-slate-400 mb-5">
          Projects and recommendations will be dynamically calibrated to your chosen level.
        </p>

        <div className="space-y-3 mb-6">
          {levels.map((item) => (
            <button
              key={item.level}
              onClick={() => onSelectLevel(item.level)}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                currentLevel === item.level
                  ? 'border-sky-500 bg-sky-950/30'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-100">{item.title}</span>
                {currentLevel === item.level && (
                  <span className="text-xs text-sky-400 font-semibold">Active</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-1.5">{item.desc}</p>
              <p className="text-[11px] text-slate-500 font-mono">{item.criteria}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
