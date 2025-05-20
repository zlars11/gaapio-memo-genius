
import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Welcome to Gaapio</h1>
          <p className="text-xl text-center mb-8">
            AI-Powered Accounting Memos for Modern Accounting Teams
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
