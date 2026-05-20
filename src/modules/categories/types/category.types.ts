export type CategoryRecord = {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export type CreateCategoryRepositoryInput = {
  name: string;
  description: string;
};

export type UpdateCategoryRepositoryInput = {
  name?: string;
  description?: string;
  updated_at: Date;
};
