// src/pages/dashboard/Nutritions.jsx
import React, { useState } from 'react';
import { FireIcon, HeartIcon, ChartBarIcon, BeakerIcon } from '@heroicons/react/24/solid';

const Nutritions = () => {
  const [nutritionData] = useState([
    {
      category: 'Proteins',
      items: [
        { name: 'Chicken Breast', amount: '200g', calories: 165, protein: 31 },
        { name: 'Greek Yogurt', amount: '150g', calories: 130, protein: 11 }
      ],
      color: 'bg-blue-100',
      icon: <HeartIcon className="h-6 w-6 text-blue-600" />
    },
    {
      category: 'Carbohydrates',
      items: [
        { name: 'Brown Rice', amount: '1 cup', calories: 215, carbs: 45 },
        { name: 'Sweet Potato', amount: '200g', calories: 180, carbs: 41 }
      ],
      color: 'bg-green-100',
      icon: <FireIcon className="h-6 w-6 text-green-600" />
    },
    {
      category: 'Supplements',
      items: [
        { name: 'Whey Protein', amount: '1 scoop', calories: 120, protein: 24 },
        { name: 'Multivitamin', amount: '1 tablet', calories: 5 }
      ],
      color: 'bg-purple-100',
      icon: <BeakerIcon className="h-6 w-6 text-purple-600" />
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ChartBarIcon className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-800">Nutrition Tracker</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nutritionData.map((category, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow
              border border-white/20 relative overflow-hidden"
            >
              <div className={`${category.color} p-3 rounded-full w-fit mb-4`}>
                {category.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{category.category}</h2>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className="p-4 rounded-lg bg-gray-50 hover:bg-white transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.amount}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {item.calories} kcal
                      </span>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-gray-600">
                      {item.protein && <span>🍗 {item.protein}g protein</span>}
                      {item.carbs && <span>🌾 {item.carbs}g carbs</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nutritions;