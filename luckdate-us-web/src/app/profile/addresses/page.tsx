'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, X } from 'lucide-react';

export default function AddressesPage() {
  const { addresses, addAddress } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zip: '' });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addAddress({
          id: Date.now().toString(),
          ...form
      });
      setIsOpen(false);
      setForm({ fullName: '', phone: '', street: '', city: '', state: '', zip: '' });
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-['Montserrat']">My Addresses</h2>
        <Button 
            onClick={() => setIsOpen(true)}
            className="bg-[#D8CBB8]/10 text-[#D8CBB8] hover:bg-[#D8CBB8]/20 hover:text-[#D8CBB8] rounded-full gap-2"
        >
            <Plus className="w-4 h-4"/> Add New
        </Button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-16 text-center">
             <MapPin className="w-8 h-8 text-gray-300 mb-4" />
             <h3 className="text-lg font-bold text-gray-700 mb-1">No addresses found</h3>
             <p className="text-sm text-gray-500 max-w-xs">Your address will be automatically saved here after your first order.</p>
          </div>
        ) : (
          addresses.map(addr => (
            <div key={addr.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
               <div className="flex items-center justify-between mb-2">
                 <h4 className="font-bold text-gray-900">{addr.fullName}</h4>
                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">Default</span>
               </div>
               <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                 {addr.street}, {addr.city}, {addr.state} {addr.zip} <br/>
                 {addr.phone}
               </p>
               <div className="mt-4 flex gap-3">
                 <button className="text-sm font-medium text-[#D8CBB8] hover:text-[#C4B5A0]">Edit</button>
                 <button className="text-sm font-medium text-red-400 hover:text-red-500">Delete</button>
               </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
                <h3 className="text-2xl font-bold font-['Montserrat'] mb-6">Add New Address</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input required type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D8CBB8]/50 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D8CBB8]/50 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                        <input required type="text" value={form.street} onChange={e => setForm({...form, street: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D8CBB8]/50 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D8CBB8]/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                            <input required type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D8CBB8]/50 focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input required type="text" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D8CBB8]/50 focus:outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white rounded-xl py-3 font-bold mt-4 transition-colors">
                        Save Address
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
