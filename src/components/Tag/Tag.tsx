import { cn } from '@/lib/utils';
import React from 'react';

interface TagProps {
  tag: string;
}

const Tag: React.FC<TagProps> = ({ tag }) => {
  return <span className={cn("tech-tag", (tag === 'React' || tag === 'Vue') && "font-bold")}>{tag}</span>;
};

export default Tag;