import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VoucherForm = ({ onSubmit, onCancel, companyId }) => {
  const [ledgers, setLedgers] = useState([]);
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      voucherType: 'Payment',
      date: new Date().toISOString().split('T')[0],
      entries: [
        { ledger: '', amount: 0, type: 'Dr' },
        { ledger: '', amount: 0, type: 'Cr' }
      ],
      narration: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries'
  });

  const watchedEntries = watch('entries');
  const voucherType = watch('voucherType');

  useEffect(() => {
    fetchLedgers();
  }, []);

  useEffect(() => {
    generateVoucherNumber();
  }, [voucherType]);

  useEffect(() => {
    calculateTotal();
  }, [watchedEntries]);

  const fetchLedgers = async () => {
    try {
      const response = await axios.get(`/api/ledgers?companyId=${companyId}`);
      setLedgers(response.data);
    } catch (error) {
      toast.error('Error fetching ledgers');
    }
  };

  const generateVoucherNumber = () => {
    const prefix = voucherType.substring(0, 3).toUpperCase();
    const number = Math.floor(Math.random() * 10000) + 1;
    setValue('voucherNumber', `${prefix}${number.toString().padStart(4, '0')}`);
  };

  const calculateTotal = () => {
    const total = watchedEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
    setValue('totalAmount', total);
  };

  const addEntry = () => {
    append({ ledger: '', amount: 0, type: 'Dr' });
  };

  const removeEntry = (index) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const handleFormSubmit = (data) => {
    const debitTotal = data.entries
      .filter(entry => entry.type === 'Dr')
      .reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0);
    
    const creditTotal = data.entries
      .filter(entry => entry.type === 'Cr')
      .reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0);

    if (Math.abs(debitTotal - creditTotal) > 0.01) {
      toast.error('Debit and Credit totals must be equal');
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Voucher Type *
          </label>
          <select
            {...register('voucherType', { required: 'Voucher type is required' })}
            className="input-field"
          >
            <option value="Payment">Payment</option>
            <option value="Receipt">Receipt</option>
            <option value="Journal">Journal</option>
            <option value="Sales">Sales</option>
            <option value="Purchase">Purchase</option>
            <option value="Contra">Contra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Voucher Number *
          </label>
          <input
            type="text"
            {...register('voucherNumber', { required: 'Voucher number is required' })}
            className="input-field"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Voucher Entries</h3>
          <button
            type="button"
            onClick={addEntry}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Entry</span>
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
              <div>
                <select
                  {...register(`entries.${index}.ledger`, { required: 'Ledger is required' })}
                  className="input-field"
                >
                  <option value="">Select Ledger</option>
                  {ledgers.map(ledger => (
                    <option key={ledger._id} value={ledger._id}>
                      {ledger.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  {...register(`entries.${index}.amount`, { 
                    required: 'Amount is required',
                    valueAsNumber: true,
                    min: { value: 0.01, message: 'Amount must be greater than 0' }
                  })}
                  className="input-field"
                />
              </div>

              <div>
                <select
                  {...register(`entries.${index}.type`)}
                  className="input-field"
                >
                  <option value="Dr">Debit (Dr)</option>
                  <option value="Cr">Credit (Cr)</option>
                </select>
              </div>

              <div className="flex items-center">
                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Narration
        </label>
        <textarea
          {...register('narration')}
          className="input-field"
          rows="3"
          placeholder="Enter narration (optional)"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="submit" className="btn-primary flex-1">
          Create Voucher
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

export default VoucherForm;