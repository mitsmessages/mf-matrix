import { Suspense, lazy } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";

const JourneyPage = lazy(() => import("@/features/journey/JourneyPage"));
const AllocationPage = lazy(() => import("@/features/allocation/AllocationPage"));
const GoalPage = lazy(() => import("@/features/goal/GoalPage"));
const ScreenerPage = lazy(() => import("@/features/screener/ScreenerPage"));
const DiligencePage = lazy(() => import("@/features/diligence/DiligencePage"));
const ScenarioPage = lazy(() => import("@/features/scenario/ScenarioPage"));
const DataPage = lazy(() => import("@/features/data/DataPage"));
const PortfolioPage = lazy(() => import("@/features/portfolio/PortfolioPage"));

function Loading() {
  return (
    <div className="flex items-center justify-center py-24 text-sm text-stone-500">
      <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-stone-400 border-t-transparent" />
      Loading…
    </div>
  );
}

export function App() {
  return (
    // Hash routing so deep links work on any static host with no rewrite rules.
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/journey" replace />} />
          <Route
            path="/journey"
            element={
              <Suspense fallback={<Loading />}>
                <JourneyPage />
              </Suspense>
            }
          />
          <Route
            path="/allocation"
            element={
              <Suspense fallback={<Loading />}>
                <AllocationPage />
              </Suspense>
            }
          />
          <Route
            path="/goal"
            element={
              <Suspense fallback={<Loading />}>
                <GoalPage />
              </Suspense>
            }
          />
          <Route
            path="/screener"
            element={
              <Suspense fallback={<Loading />}>
                <ScreenerPage />
              </Suspense>
            }
          />
          <Route
            path="/diligence"
            element={
              <Suspense fallback={<Loading />}>
                <DiligencePage />
              </Suspense>
            }
          />
          <Route
            path="/scenario"
            element={
              <Suspense fallback={<Loading />}>
                <ScenarioPage />
              </Suspense>
            }
          />
          <Route
            path="/portfolio"
            element={
              <Suspense fallback={<Loading />}>
                <PortfolioPage />
              </Suspense>
            }
          />
          <Route
            path="/data"
            element={
              <Suspense fallback={<Loading />}>
                <DataPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/journey" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
