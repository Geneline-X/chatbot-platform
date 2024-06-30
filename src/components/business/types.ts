
import { Prisma } from '@prisma/client';



// Ensure `Business` type includes the structure
export type Business = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  industry: string | null;
  createAt: string;
  updatedAt: string;
  chatbots: {
    id: string;
    businessId: string;
    name: string;
    systemInstruction: string | null;
    urlsToBusinessWebsite: string | null;
    customConfigurations: Prisma.JsonValue;
    createAt: string;
    updatedAt: string;
  }[];
};
  export interface CreateBusinessFormProps {
    onSave: (business: Omit<Business, 'id'>) => void;
    onCancel: () => void;
  }
  
  export interface BusinessListProps {
    businesses: Business[];
    onEdit: (business: Business) => void;
    onDelete: (id: string) => void;
  }