export interface Hobby {
  id: string;
  name: string;
  category: "sports" | "intelligence" | "art";
  image_url: string;
  created_at?: string;
}

export interface Bookmark {
  id: number;
  user_id: string;
  hobby_id: string;
  created_at: string;
}
