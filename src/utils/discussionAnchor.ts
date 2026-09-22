import { DiscussionTag, SlideItem } from '../types';

/** 发给模型的提问：强制钉在当前页（P1-1） */
export function buildAnchoredQuery(
  userText: string,
  slide: SlideItem,
  highlightedText?: string | null,
  discussionTag?: DiscussionTag | null
): string {
  const parts = [
    `【锚定课件】Slide P.${slide.index}《${slide.title}》`,
    slide.sectionTitle ? `【篇章】${slide.sectionTitle}` : '',
    (slide.keywords || []).length ? `【关键词】${(slide.keywords || []).slice(0, 6).join(' · ')}` : '',
    highlightedText ? `【高亮选段】「${highlightedText.slice(0, 280)}」` : '',
    discussionTag ? `【发言标签】${discussionTag}` : '',
    `【参会者问题】${userText}`
  ].filter(Boolean);
  return parts.join('\n');
}

export function formatAnchorChip(slideIndex: number, title: string): string {
  return `锚定：P.${slideIndex}《${title}》`;
}
