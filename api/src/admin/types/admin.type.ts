export type AdminResponse = {
  data: {
    id: string;
    email: string;
    displayName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: {
      id: string;
      name: string;
    };
    scopes: string[];
  };
};
