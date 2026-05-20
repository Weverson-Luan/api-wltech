export type ProjectRecord = {
  id: number;
  name_project: string;
  sub_title: string;
  tags: string;
  description: string;
  foto_url: string;
  created_at: Date;
  updated_at: Date;
};

export type CreateProjectRepositoryInput = {
  name_project: string;
  sub_title: string;
  tags: string;
  description: string;
  foto_url: string;
};

export type UpdateProjectRepositoryInput = {
  name_project?: string;
  sub_title?: string;
  tags?: string;
  description?: string;
  foto_url?: string;
  updated_at: Date;
};
