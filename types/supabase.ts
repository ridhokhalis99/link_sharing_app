export type Database = {
  public: {
    Tables: {
      links: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string;
          platform: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title: string;
          platform: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          title?: string;
          platform?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
