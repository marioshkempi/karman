'use client';
import React, { useState } from 'react';
import Breadcrumb from '@modules/common/components/breadcrumb';

const ContactForm = () => {
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3 sm:py-3">
      <Breadcrumb showEllipsis={true} ellipsisPosition={1} />
      
      <div className="mt-8 max-w-[900px] mx-auto">
        <h1 className="text-primary text-[35px] font-normal mb-8">
          Επικοινωνήστε μαζί μας
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <label className="text-secondary text-[20px] w-32 flex-shrink-0">
              Θέμα
            </label>
            <div className="relative flex-1">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-primary rounded-[8.49px] text-primary placeholder:text-primary appearance-none focus:outline-none focus:ring-0"
              >
                <option value="">XXXXXXXXX</option>
                <option value="general">General Inquiry</option>
                <option value="support">Support</option>
                <option value="feedback">Feedback</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L10 10L19 1" stroke="currentColor" strokeWidth="2" className="text-primary"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-secondary text-[19px] w-32 flex-shrink-0">
              email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border-2 border-primary rounded-[8.49px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-start gap-4">
            <label className="text-secondary text-[20px] w-32 flex-shrink-0 pt-3">
              Μήνυμα
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="γράψε εδώ"
              rows={6}
              className="flex-1 px-4 py-3 border-2 border-primary rounded-[8.49px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 resize-none"
            />
          </div>

        <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-primary text-white rounded-[8.49px] hover:opacity-90 transition-opacity"
              style={{ width: '198.06px', height: '59.65px' }}
            >
              Αποστολή
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ContactForm;