"use client";
import React, { useState } from 'react';
import { Loader2 } from "lucide-react";

const MessagesList = ({ messagesData }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!messagesData) {
    return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const { frequentlyAskedQuestions, sentimentAnalysis } = messagesData;

  // Calculate the paginated FAQs
  const totalItems = frequentlyAskedQuestions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFAQs = frequentlyAskedQuestions.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
        {totalItems === 0 ? (
          <p>No frequently asked questions found.</p>
        ) : (
          <>
            <ul className="list-disc pl-5">
              {currentFAQs.map((question: string, index: number) => (
                <li key={index} className="mb-2">{question}</li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
        {Object.keys(sentimentAnalysis).length === 0 ? (
          <p>No sentiment analysis data found.</p>
        ) : (
          <div>
            {Object.entries(sentimentAnalysis).map(([sentiment, value]: any) => (
              <div key={sentiment} className="mb-2">
                <strong>{sentiment}:</strong> {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
