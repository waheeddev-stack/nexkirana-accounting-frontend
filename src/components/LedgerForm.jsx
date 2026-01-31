import React from 'react';
import { useForm } from 'react-hook-form';

const LedgerForm = ({ onSubmit, onCancel, groups }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ledger Name *
        </label>
        <input
          type="text"
          {...register('name', { required: 'Ledger name is required' })}
          className="input-field"
          placeholder="Enter ledger name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group *
        </label>
        <select
          {...register('group', { required: 'Group is required' })}
          className="input-field"
        >
          <option value="">Select Group</option>
          {groups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
        {errors.group && (
          <p className="text-red-500 text-sm mt-1">{errors.group.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opening Balance
          </label>
          <input
            type="number"
            step="0.01"
            {...register('openingBalance', { valueAsNumber: true })}
            className="input-field"
            placeholder="0.00"
            defaultValue={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Balance Type
          </label>
          <select
            {...register('balanceType')}
            className="input-field"
            defaultValue="Dr"
          >
            <option value="Dr">Debit (Dr)</option>
            <option value="Cr">Credit (Cr)</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="submit" className="btn-primary flex-1">
          Create Ledger
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
  );
};

export default LedgerForm;