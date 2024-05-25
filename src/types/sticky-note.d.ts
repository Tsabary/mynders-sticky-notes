export type StickyNote = {
  _id: string;
  author_id: string;
  folder_id: string;
  created_at: Timestamp;
  placement: number;
  title: string;
  body: string;
};
