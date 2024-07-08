import React from 'react';
import { Trash, Loader2 } from 'lucide-react'; // Ensure you have the appropriate icons
import { trpc } from '@/app/_trpc/client';
import { useBusiness } from './BusinessContext'; // Import the useBusiness hook
import { BusinessFromProps } from './CreateBusinessForm';
import { Business } from './types';

interface BusinessListProps {
  businesses: Business[] | undefined;
  onEdit: (business: Business) => void;
  onDelete: (id: string) => void;
  currentDeletingFile: string | null;
}

const BusinessList: React.FC<BusinessListProps> = ({ businesses, onEdit, onDelete, currentDeletingFile }) => {
  const { setCurrentBusiness } = useBusiness(); // Use the context hook

  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
      {businesses?.map((business) => (
        <li
          key={business.id}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg cursor-pointer" // Add cursor-pointer for click indication
          onClick={() => setCurrentBusiness(business)} 
           
        >
          <div className="flex flex-col gap-2 p-4 h-full">
            <h3 className="truncate text-lg font-medium text-zinc-900">{business.name}</h3>
            <p className="truncate font-medium text-zinc-900">{business.description}</p>
            <div className="mt-auto flex justify-between items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  onEdit(business);
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(business.id);
                }}
                className="text-red-500 hover:text-red-600"
              >
                {currentDeletingFile === business.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BusinessList;

