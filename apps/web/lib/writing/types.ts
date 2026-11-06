export type WritingBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; code: string }
  | { type: 'note'; text: string };

export type WritingSection = {
  heading: string;
  blocks: WritingBlock[];
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** ISO 날짜. sitemap의 lastModified로도 쓴다. */
  date: string;
  tags: string[];
  lead: string;
  sections: WritingSection[];
};
