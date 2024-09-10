import React from 'react';
import { motion } from 'framer-motion';
import { Trash, Loader2, Building, Briefcase, Edit, Trash2 } from 'lucide-react'; // Ensure you have the appropriate icons
import { trpc } from '@/app/_trpc/client';
import { useBusiness } from './BusinessContext'; // Import the useBusiness hook
import { BusinessFromProps } from './CreateBusinessForm';
import { Business } from './types';
import { Button } from '../ui/button';

interface BusinessListProps {
  businesses: any;
  onEdit: (business: Business) => void;
  onDelete: (id: string) => void;
  currentDeletingFile: string | null;
}

const BusinessList: React.FC<BusinessListProps> = ({ businesses, onEdit, onDelete, currentDeletingFile }) => {
  const { setCurrentBusiness } = useBusiness(); // Use the context hook

  return (
    <motion.ul
      className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {businesses?.map((business: any) => (
        <motion.li
          key={business.id}
          className="col-span-1 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <Building className="text-purple-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 truncate">{business.name}</h3>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">{business.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Briefcase className="mr-2" />
              {business.industry}
            </div>
            <div className="flex justify-between items-center">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(business);
                }}
                variant="outline"
                className="text-blue-500 hover:text-blue-600"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(business.id);
                }}
                variant="outline"
                className="text-red-500 hover:text-red-600"
              >
                {currentDeletingFile === business.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Trash2 className="h-4 w-4 mr-2" /> Delete</>
                )}
              </Button>
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default BusinessList;

