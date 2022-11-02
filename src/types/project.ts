export interface Project {
  name: string;
  start_date: string;
  end_date: string;
  resp_person: string;
  summary: string
  id?: number;
  company?: {
      id: number;
  };
}
