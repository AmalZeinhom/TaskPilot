export type Member = {
  user_id: string;
  metadata?: {
    name?: string;
    email?: string;
    department?: string | null;
    avatar?: string | null;
  };
};
