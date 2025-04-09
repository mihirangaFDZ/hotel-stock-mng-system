import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

const WasteLoggingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'food' as 'food' | 'beverages' | 'supplies',
    expirationDate: '',
    quantityDiscarded: '',
    unit: 'kg' as 'kg' | 'liters' | 'count',
    reason: 'expired' as 'expired' | 'spoiled' | 'damaged' | 'other',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastLoggedTime, setLastLoggedTime] = useState<string | null>(null);

  // Validation logic
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const today = new Date().toISOString().split('T')[0]; // Current date

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required.';
    }
    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required.';
    } else if (formData.expirationDate > today) {
      newErrors.expirationDate = 'Expiration date cannot be in the future.';
    }
    const quantity = parseFloat(formData.quantityDiscarded);
    if (!formData.quantityDiscarded || isNaN(quantity) || quantity <= 0) {
      newErrors.quantityDiscarded = 'Quantity must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        const submittedData = {
          ...formData,
          quantityDiscarded: parseFloat(formData.quantityDiscarded),
          dateLogged: new Date().toISOString(),
        };
        console.log('Form submitted:', submittedData);
        setIsSubmitted(true);
        setLastLoggedTime(new Date().toLocaleTimeString());
        setTimeout(() => setIsSubmitted(false), 3000); // Hide success after 3s
        resetForm();
        setIsSubmitting(false);
      }, 1000); // 1-second delay to mimic network request
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      category: 'food',
      expirationDate: '',
      quantityDiscarded: '',
      unit: 'kg',
      reason: 'expired',
    });
    setErrors({});
  };

  // Auto-set unit based on category
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value as 'food' | 'beverages' | 'supplies';
    const newUnit =
      category === 'beverages' ? 'liters' : category === 'supplies' ? 'count' : 'kg';
    setFormData({ ...formData, category, unit: newUnit });
  };

  const isFormValid =
    formData.itemName.trim() &&
    formData.expirationDate &&
    parseFloat(formData.quantityDiscarded) > 0 &&
    formData.expirationDate <= new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Log Waste Item</h2>

      {isSubmitted && (
        <div className="mb-4 p-3 bg-teal-100 text-teal-800 rounded-md flex items-center justify-between">
          <span>
            Waste item logged successfully!{' '}
            {lastLoggedTime && <span>(at {lastLoggedTime})</span>}
          </span>
          <button
            onClick={resetForm}
            className="text-teal-600 hover:text-teal-800 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Bread"
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all ${
                errors.itemName ? 'border-red-500' : ''
              }`}
              value={formData.itemName}
              onChange={(e) => {
                setFormData({ ...formData, itemName: e.target.value });
                setErrors({ ...errors, itemName: '' });
              }}
              disabled={isSubmitting}
            />
            {errors.itemName && (
              <p className="mt-1 text-sm text-red-600">{errors.itemName}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all"
              value={formData.category}
              onChange={handleCategoryChange}
              disabled={isSubmitting}
            >
              <option value="food">Food</option>
              <option value="beverages">Beverages</option>
              <option value="supplies">Supplies</option>
            </select>
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              type="date"
              required
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all ${
                errors.expirationDate ? 'border-red-500' : ''
              }`}
              value={formData.expirationDate}
              onChange={(e) => {
                setFormData({ ...formData, expirationDate: e.target.value });
                setErrors({ ...errors, expirationDate: '' });
              }}
              disabled={isSubmitting}
            />
            {errors.expirationDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expirationDate}</p>
            )}
          </div>

          {/* Quantity and Unit */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="e.g., 1.5"
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all ${
                  errors.quantityDiscarded ? 'border-red-500' : ''
                }`}
                value={formData.quantityDiscarded}
                onChange={(e) => {
                  setFormData({ ...formData, quantityDiscarded: e.target.value });
                  setErrors({ ...errors, quantityDiscarded: '' });
                }}
                disabled={isSubmitting}
              />
              {errors.quantityDiscarded && (
                <p className="mt-1 text-sm text-red-600">{errors.quantityDiscarded}</p>
              )}
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit: e.target.value as 'kg' | 'liters' | 'count',
                  })
                }
                disabled={isSubmitting}
              >
                <option value="kg">Kg</option>
                <option value="liters">Liters</option>
                <option value="count">Count</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all"
              value={formData.reason}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reason: e.target.value as 'expired' | 'spoiled' | 'damaged' | 'other',
                })
              }
              disabled={isSubmitting}
            >
              <option value="expired">Expired</option>
              <option value="spoiled">Spoiled</option>
              <option value="damaged">Damaged</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`flex-1 py-2 px-4 rounded-md text-white transition-all flex items-center justify-center ${
              isFormValid && !isSubmitting
                ? 'bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Logging...
              </>
            ) : (
              'Log Waste Item'
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default WasteLoggingForm;