import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ActiveSimulation from './pages/ActiveSimulation';
import SessionSummary from './pages/SessionSummary';

type Page = 'LANDING' | 'DASHBOARD' | 'SIMULATION' | 'SUMMARY';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('LANDING');

  if (currentPage === 'LANDING') {
    return <LandingPage onStart={() => setCurrentPage('DASHBOARD')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'SIMULATION':
        return <ActiveSimulation />;
      case 'SUMMARY':
        return <SessionSummary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentActive={currentPage} onNavigate={(p) => setCurrentPage(p as Page)}>
      {renderPage()}
    </Layout>
  );
}

export default App;
