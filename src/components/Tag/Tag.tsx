import { cn } from '@/lib/utils';
import React from 'react';
import { CORE_TAGS, REACT_ECOSYSTEM_TAGS, VUE_ECOSYSTEM_TAGS, ARCHITECTURE_TAGS, PRINCIPLES_TAGS, PROCESS_TAGS, RENDERING_TAGS, FRONTEND_CORE_TAGS, TOOLING_TAGS, UI_VISUAL_TAGS } from '@/data/tags';

interface TagProps {
  tag: string;
}

const Tag: React.FC<TagProps> = ({ tag }) => {
  const isCore = CORE_TAGS.includes(tag);
  const isArchitecture = ARCHITECTURE_TAGS.includes(tag);
  const isPrinciples = PRINCIPLES_TAGS.includes(tag);
  const isProcess = PROCESS_TAGS.includes(tag);
  const isReactEco = REACT_ECOSYSTEM_TAGS.includes(tag);
  const isVueEco = VUE_ECOSYSTEM_TAGS.includes(tag);
  const isRendering = RENDERING_TAGS.includes(tag);
  const isFrontendCore = FRONTEND_CORE_TAGS.includes(tag);
  const isTools = TOOLING_TAGS.includes(tag);
  const isUxVisual = UI_VISUAL_TAGS.includes(tag);

  // Priority: Architecture/Principles/Processes > React/Vue ecosystem > default
  let bgClass = 'bg-transparent border border-zinc-900';
  let colorClass = 'text-primary';
  if (isCore) { bgClass = 'bg-primary-bg border border-zinc-900 print:border-none font-bold'; colorClass = 'text-text-primary'; }
  if (isArchitecture) { bgClass = 'bg-orange-500'; colorClass = 'text-white'; }
  else if (isPrinciples) { bgClass = 'bg-violet-500'; colorClass = 'text-white'; }
  else if (isProcess) { bgClass = 'bg-zinc-700'; colorClass = 'text-white'; }
  else if (isReactEco) { bgClass = 'bg-sky-500'; colorClass = 'text-white'; }
  else if (isVueEco) { bgClass = 'bg-emerald-500'; colorClass = 'text-white'; }
  else if (isRendering) { bgClass = 'bg-blue-600'; colorClass = 'text-white'; }
  else if (isFrontendCore) { bgClass = 'bg-primary-bg border border-zinc-900 print:border-none'; colorClass = 'text-text-primary'; }
  else if (isTools) { bgClass = 'bg-slate-500'; colorClass = 'text-white'; }
  else if (isUxVisual) { bgClass = 'bg-yellow-400'; colorClass = 'text-black'; }
  return <span className={cn('px-2 py-1 text-xs rounded-md', bgClass, colorClass)}>{tag}</span>;
};

export default Tag;