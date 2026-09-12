/**
 * UI smoke tests — render every page under several store states and assert it
 * does not throw and shows the expected derived content.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import JourneyPage from "@/features/journey/JourneyPage";
import AllocationPage from "@/features/allocation/AllocationPage";
import GoalPage from "@/features/goal/GoalPage";
import ScreenerPage from "@/features/screener/ScreenerPage";
import DiligencePage from "@/features/diligence/DiligencePage";
import ScenarioPage from "@/features/scenario/ScenarioPage";
import DataPage from "@/features/data/DataPage";
import { useProfile } from "@/store/profile";
import { defaultSelections, defaultWeights } from "@/data/defaults";
import { ALLOCATION_PRESETS } from "@/domain/finance/sleeves";

const renderPage = (ui: React.ReactElement) =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {ui}
    </MemoryRouter>,
  );

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Data & sources page", () => {
  it("states what is real vs assumed", () => {
    renderPage(<DataPage />);
    expect(screen.getByText(/What is real, and what is assumed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Not available/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Assumptions \(labelled\)/i).length).toBeGreaterThan(0);
  });
});

describe("pages render without throwing", () => {
  it("Journey", () => {
    renderPage(<JourneyPage />);
    expect(screen.getByText(/five-stage decision engine/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The Advisory Value Chain/i).length).toBeGreaterThan(0);
  });

  it("Journey: conceptual modules are not dead ends", async () => {
    renderPage(<JourneyPage />);
    const user = userEvent.setup();
    await user.click(screen.getAllByText(/Macro Factors & Sector Transmission/i)[0]!);
    expect(await screen.findByText(/Conceptual module/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Apply in Stage 1/i).length).toBeGreaterThan(0);
  });

  it("Allocation (aggressive)", () => {
    useProfile.setState({ profile: "aggressive", model: "enhanced", weights: { ...ALLOCATION_PRESETS.aggressive.enhanced.weights } });
    renderPage(<AllocationPage />);
    expect(screen.getByText(/Strategic asset allocation/i)).toBeInTheDocument();
    expect(screen.getByText(/Live portfolio metrics/i)).toBeInTheDocument();
  });

  it("Goal", () => {
    renderPage(<GoalPage />);
    expect(screen.getByText(/Goal & SIP solver/i)).toBeInTheDocument();
    expect(screen.getByText(/Required monthly SIP/i)).toBeInTheDocument();
  });

  it("Screener", () => {
    renderPage(<ScreenerPage />);
    expect(screen.getByText(/Five-hurdle fund screener/i)).toBeInTheDocument();
    // Derived verdicts should appear (at least one qualified).
    expect(screen.getAllByText(/QUALIFIED/i).length).toBeGreaterThan(0);
  });
});

describe("Diligence across profiles", () => {
  it("conservative portfolio renders and offers review-allocation navigation", () => {
    useProfile.setState({
      profile: "conservative",
      model: "enhanced",
      weights: { ...ALLOCATION_PRESETS.conservative.enhanced.weights },
      selections: defaultSelections(),
    });
    renderPage(<DiligencePage />);
    expect(screen.getByText(/Portfolio due diligence/i)).toBeInTheDocument();
    // The example the user flagged: Stage 4 -> Stage 1 link must exist intentionally.
    expect(screen.getByText(/Review Stage 1 allocation/i)).toBeInTheDocument();
    // Stage 4 also flows forward into Stage 5 (Synthesis).
    expect(screen.getByText(/Proceed to Stage 5/i)).toBeInTheDocument();
  });

  it("moderate portfolio renders a derived score", () => {
    useProfile.setState({
      profile: "moderate",
      model: "enhanced",
      weights: { ...ALLOCATION_PRESETS.moderate.enhanced.weights },
      selections: defaultSelections(),
    });
    renderPage(<DiligencePage />);
    expect(screen.getByText(/Derived score/i)).toBeInTheDocument();
    expect(screen.getByText(/Committee scorecard/i)).toBeInTheDocument();
  });

  it("Scenario page renders the summary and recommendations", () => {
    useProfile.setState({
      profile: "aggressive",
      model: "enhanced",
      weights: { ...ALLOCATION_PRESETS.aggressive.enhanced.weights },
      selections: defaultSelections(),
    });
    renderPage(<ScenarioPage />);
    expect(screen.getAllByText(/What else could add value/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Source: L/i).length).toBeGreaterThan(0);
    // Phase 5: tax estimate and historical backtest render.
    expect(screen.getAllByText(/Capital-gains impact/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Historical outcome/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/XIRR/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/beat the benchmark/i).length).toBeGreaterThan(0);
  });

  it("Scenario page shows an empty state with no funds", () => {
    useProfile.setState({ selections: {} });
    renderPage(<ScenarioPage />);
    expect(screen.getByText(/No scenario yet/i)).toBeInTheDocument();
  });

  it("empty selections shows the empty state, not a crash or phantom score", () => {
    useProfile.setState({
      profile: "aggressive",
      model: "enhanced",
      weights: defaultWeights(),
      selections: {},
    });
    renderPage(<DiligencePage />);
    expect(screen.getByText(/No funds selected/i)).toBeInTheDocument();
  });
});
