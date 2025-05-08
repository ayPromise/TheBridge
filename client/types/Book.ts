export interface BookDescriptionBlock {
  type: 'paragraph';
  children: {
    type: 'text';
    text: string;
  }[];
}

export interface BookOwner {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  password: string | null;
  resetPasswordToken: string | null;
  confirmationToken: string | null;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
}

export interface Book {
  id: number;
  documentId: string;
  title: string;
  language: string;
  description: BookDescriptionBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
  slug: string;
  date: string | null;
  owner: BookOwner;
}