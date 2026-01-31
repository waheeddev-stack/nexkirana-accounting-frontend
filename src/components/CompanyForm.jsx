import React from 'react';
import { useForm } from 'react-hook-form';
import { Building2, MapPin, Phone, Mail, CreditCard, Calendar, Globe } from 'lucide-react';

const CompanyForm = ({ company, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: company || {}
  });

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Name */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-tally-gray-700">
            <Building2 size={16} />
            <span>Company Name *</span>
          </label>
          <input
            type="text"
            {...register('name', { required: 'Company name is required' })}
            className="input-field"
            placeholder="Enter your company name"
          />
          {errors.name && (
            <p className="text-tally-danger text-sm flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-tally-gray-700">
            <MapPin size={16} />
            <span>Business Address</span>
          </label>
          <textarea
            {...register('address')}
            className="input-field resize-none"
            rows="3"
            placeholder="Enter complete business address"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-tally-gray-700">
              <Phone size={16} />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="input-field"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-tally-gray-700">
              <Mail size={16} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="company@example.com"
            />
          </div>
        </div>

        {/* Tax Information */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-tally-gray-700">
            <CreditCard size={16} />
            <span>GSTIN</span>
          </label>
          <input
            type="text"
            {...register('gstin')}
            className="input-field"
            placeholder="22AAAAA0000A1Z5"
            maxLength="15"
          />
          <p className="text-xs text-tally-gray-500">
            15-digit GST Identification Number (optional)
          </p>
        </div>

        {/* Financial Year & Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-tally-gray-700">
              <Calendar size={16} />
              <span>Financial Year Start</span>
            </label>
            <input
              type="date"
              {...register('financialYearStart')}
              className="input-field"
            />
            <p className="text-xs text-tally-gray-500">
              Default: April 1st of current year
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-tally-gray-700">
              <Globe size={16} />
              <span>Base Currency</span>
            </label>
            <select
              {...register('baseCurrency')}
              className="input-field"
              defaultValue="INR"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-tally-gray-200">
          <button type="submit" className="btn-primary flex-1">
            {company ? 'Update Company' : 'Create Company'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;