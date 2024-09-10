"use client"

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CreateBusinessForm from './CreateBusinessForm';
import BusinessList from './BusinessList';
import { BusinessFromProps } from './CreateBusinessForm';
import { trpc } from '@/app/_trpc/client';
import { Loader2, Plus, Trash, Ghost } from 'lucide-react'; // Ensure you have the appropriate icons
import { Button } from '../ui/button';
import { Business } from './types';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

type BusinessSave = Omit<BusinessFromProps, 'id'>

const Main = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [currentDeletingFile, setCurrentDeletingFile] = useState<string | null>(null);

  const { data: businesses, isLoading } = trpc.getAllBusinesses.useQuery();
  
  const utils = trpc.useContext();
  const { mutate: deleteBusiness } = trpc.deleteBusiness.useMutation({
    onSuccess: () => {
      utils.getAllBusinesses.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentDeletingFile(id);
    },
    onSettled: () => {
      setCurrentDeletingFile(null);
    }
  });

  const { mutate: createBusiness, isLoading:creatingLoading } = trpc.createBusiness.useMutation({
    onSuccess: () => {
      utils.getAllBusinesses.invalidate();
    }
  });
  const { mutate: updateBusiness } = trpc.updateBusiness.useMutation({
    onSuccess: () => {
      utils.getAllBusinesses.invalidate();
    }
  });

  const handleSaveBusiness = (business: BusinessSave) => {
    if (editingBusiness) {
      updateBusiness({ ...editingBusiness, ...business });
      setEditingBusiness(null);
    } else {
      createBusiness({ ...business });
    }
    setIsCreating(false);
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setIsCreating(true);
  };

  const handleDeleteBusiness = (id: string) => {
    deleteBusiness({ id });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingBusiness(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {isCreating ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CreateBusinessForm isLoading={creatingLoading} onSave={handleSaveBusiness} onCancel={handleCancel} />
        </motion.div>
      ) : (
        <motion.div
          className="flex justify-center mb-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsCreating(true)}
            className="text-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Create New Business
          </Button>
        </motion.div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : businesses?.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s create your first business.</p>
        </div>
      ) : (
        businesses && (
          // @ts-ignore
          <BusinessList
            businesses={businesses}
            onEdit={handleEditBusiness}
            onDelete={handleDeleteBusiness}
            currentDeletingFile={currentDeletingFile}
          />
        )
      )}
    </div>
  );
};

export default Main;
