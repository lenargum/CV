/**
 * Lightweight markdown parser for CV content
 * Supports: **bold**, *italic*, `code`, [links](url), and ~~strikethrough~~
 */

import React from 'react';

export interface MarkdownNode {
  type: 'text' | 'bold' | 'italic' | 'code' | 'link' | 'strikethrough';
  content: string;
  url?: string;
  isBold?: boolean;
  isItalic?: boolean;
}

/**
 * Parse markdown text into structured nodes with support for nested elements
 */
export function parseMarkdown(text: string): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  let currentIndex = 0;

  // Enhanced regex patterns that handle nested elements
  const patterns = [
    // Bold links: **[text](url)**
    { type: 'bold-link' as const, regex: /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g },
    // Italic links: *[text](url)*
    { type: 'italic-link' as const, regex: /\*\[([^\]]+)\]\(([^)]+)\)\*/g },
    // Regular bold: **text**
    { type: 'bold' as const, regex: /\*\*((?!\[).*?)\*\*/g },
    // Regular italic: *text* (but not if it's part of a link)
    { type: 'italic' as const, regex: /\*((?!\[).*?)\*/g },
    // Code: `text`
    { type: 'code' as const, regex: /`(.*?)`/g },
    // Regular links: [text](url)
    { type: 'link' as const, regex: /\[([^\]]+)\]\(([^)]+)\)/g },
    // Strikethrough: ~~text~~
    { type: 'strikethrough' as const, regex: /~~(.*?)~~/g },
  ];

  while (currentIndex < text.length) {
    let nearestMatch: { 
      index: number; 
      length: number; 
      type: MarkdownNode['type'] | 'bold-link' | 'italic-link'; 
      content: string; 
      url?: string;
      isBold?: boolean;
      isItalic?: boolean;
    } | null = null;

    // Find the nearest markdown pattern
    for (const pattern of patterns) {
      pattern.regex.lastIndex = currentIndex;
      const match = pattern.regex.exec(text);
      
      if (match && (nearestMatch === null || match.index < nearestMatch.index)) {
        nearestMatch = {
          index: match.index,
          length: match[0].length,
          type: pattern.type,
          content: match[1],
          url: pattern.type.includes('link') ? match[2] : undefined,
          isBold: pattern.type === 'bold-link',
          isItalic: pattern.type === 'italic-link',
        };
      }
    }

    if (nearestMatch) {
      // Add text before the match
      if (nearestMatch.index > currentIndex) {
        nodes.push({
          type: 'text',
          content: text.slice(currentIndex, nearestMatch.index),
        });
      }

      // Add the matched element
      if (nearestMatch.type === 'bold-link' || nearestMatch.type === 'italic-link') {
        nodes.push({
          type: 'link',
          content: nearestMatch.content,
          url: nearestMatch.url,
          isBold: nearestMatch.isBold,
          isItalic: nearestMatch.isItalic,
        } as any);
      } else {
        nodes.push({
          type: nearestMatch.type as MarkdownNode['type'],
          content: nearestMatch.content,
          url: nearestMatch.url,
        });
      }

      currentIndex = nearestMatch.index + nearestMatch.length;
    } else {
      // No more matches, add remaining text
      nodes.push({
        type: 'text',
        content: text.slice(currentIndex),
      });
      break;
    }
  }

  return nodes;
}

/**
 * Convert markdown nodes to React elements
 */
export function renderMarkdown(text: string): React.ReactNode[] {
  const nodes = parseMarkdown(text);
  
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'bold':
        return React.createElement('strong', { key: index, className: 'font-semibold text-text-primary' }, node.content);
      
      case 'italic':
        return React.createElement('em', { key: index, className: 'italic' }, node.content);
      
      case 'code':
        return React.createElement('code', { 
          key: index, 
          className: 'bg-gray-100 text-text-primary px-1.5 py-0.5 rounded text-sm font-mono' 
        }, node.content);
      
      case 'link':
        const linkClasses = [
          'underline hover:text-black',
          node.isBold ? 'font-semibold text-text-primary' : '',
          node.isItalic ? 'italic' : ''
        ].filter(Boolean).join(' ');
        
        return React.createElement('a', { 
          key: index, 
          href: node.url, 
          target: '_blank', 
          rel: 'noopener noreferrer',
          className: linkClasses
        }, node.content);
      
      case 'strikethrough':
        return React.createElement('del', { key: index, className: 'line-through text-text-tertiary' }, node.content);
      
      case 'text':
      default:
        return node.content;
    }
  });
}

/**
 * React component for rendering markdown text
 */
interface MarkdownTextProps {
  children: string;
  className?: string;
}

export function MarkdownText({ children, className = '' }: MarkdownTextProps): React.ReactElement {
  const elements = renderMarkdown(children);
  
  return React.createElement('span', { className }, ...elements);
} 