"use client"
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CreateBusinessForm from './CreateBusinessForm';
import BusinessList from './BusinessList';
import { Business } from './CreateBusinessForm';

const BusinessManager: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const handleSaveBusiness = (business: Omit<Business, 'id'>) => {
    if (editingBusiness) {
      setBusinesses((prevBusinesses) =>
        prevBusinesses.map((b) =>
          b.id === editingBusiness.id ? { ...editingBusiness, ...business } : b
        )
      );
      setEditingBusiness(null);
    } else {
      setBusinesses((prevBusinesses) => [
        ...prevBusinesses,
        { ...business, id: uuidv4() },
      ]);
    }
    setIsCreating(false);
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setIsCreating(true);
  };

  const handleDeleteBusiness = (id: string) => {
    setBusinesses((prevBusinesses) => prevBusinesses.filter((b) => b.id !== id));
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingBusiness(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {isCreating ? (
        <CreateBusinessForm onSave={handleSaveBusiness} onCancel={handleCancel} />
      ) : (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Business
          </button>
        </div>
      )}
      <BusinessList
        businesses={businesses}
        onEdit={handleEditBusiness}
        onDelete={handleDeleteBusiness}
      />
    </div>
  );
};

export default BusinessManager;
