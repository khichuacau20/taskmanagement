export interface Task {
  id: number;
  user_id: number;
  category_id?: number;
  priority_id?: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}
