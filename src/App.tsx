import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import GoalModal from './components/GoalModal';
import Dashboard from './pages/Dashboard';
import ActiveSimulation from './pages/ActiveSimulation';
import SessionSummary from './pages/SessionSummary';
import { useSession } from './hooks/useSession';
import type { ExerciseType, SessionMode } from './utils/types';

type View = 'LANDING' | 'APP';

function App() {
  const [view, setView] = useState<View>('LANDING');
  const [modalExercise, setModalExercise] = useState<ExerciseType | null>(null);
  const { session, startSession, addFeedback, endSession, resetSession } = useSession();

  if (view === 'LANDING') {
    return <LandingPage onStart={() => setView('APP')} />;
  }

  const handleSelectExercise = (exercise: ExerciseType) => {
    setModalExercise(exercise);
  };

  const handleConfirmGoal = (target: number, mode: SessionMode) => {
    if (modalExercise) {
      startSession(modalExercise, target, mode);
      setModalExercise(null);
    }
  };

  const handleCloseModal = () => {
    setModalExercise(null);
  };

  const renderContent = () => {
    if (session.status === 'ACTIVE') {
      return (
        <ActiveSimulation
          session={session}
          onAddFeedback={addFeedback}
          onEndSession={endSession}
        />
      );
    }

    if (session.status === 'COMPLETED') {
      return (
        <SessionSummary
          session={session}
          onRestart={resetSession}
        />
      );
    }

    return (
      <Dashboard onSelectExercise={handleSelectExercise} />
    );
  };

  const currentActivePage = () => {
    if (session.status === 'ACTIVE') return 'SIMULATION';
    if (session.status === 'COMPLETED') return 'SUMMARY';
    return 'DASHBOARD';
  };

  return (
    <>
      <Layout
        currentActive={currentActivePage()}
        onNavigate={(p) => {
          if (p === 'DASHBOARD') resetSession();
        }}
      >
        {renderContent()}
      </Layout>

      {/* Goal Modal Overlay */}
      {modalExercise && (
        <GoalModal
          exercise={modalExercise}
          onConfirm={handleConfirmGoal}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default App;
