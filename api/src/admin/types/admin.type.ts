export type AdminResponse = {
  data: {
    id: string;
    email: string;
    displayName: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    role: {
      id: string;
      name: string;
    };
    scopes: string[];
  };
};
