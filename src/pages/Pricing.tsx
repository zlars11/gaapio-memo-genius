
import React from 'react';
import { header as Header } from '@/components/header';
import { footer as Footer } from '@/components/footer';

const Pricing: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
          <p className="text-xl text-center mb-8">
            Choose the right plan for your accounting needs
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Pricing tiers will go here */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Starter</h2>
              <p className="text-3xl font-bold mt-4">$99<span className="text-base font-normal">/month</span></p>
              <ul className="mt-6 space-y-4">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
              </ul>
            </div>
            {/* Additional pricing tiers would go here */}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Pricing;
