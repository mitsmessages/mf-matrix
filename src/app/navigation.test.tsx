/**
 * End-to-end navigation test. Drives the real App shell through every stage and
 * verifies the Stage 4 -> Stage 1 "Review allocation" path the user flagged.
 */
import { describe, expect, it, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
  configure,
  waitFor,
} from "@testing-library/react";
import { App } from "./App";
import { useProfile } from "@/store/profile";

// Lazy route chunks can take a moment under parallel test load.
configure({ asyncUtilTimeout: 8000 });

beforeEach(() => {
  cleanup();
  localStorage.clear();
  window.location.hash = "";
});

const stageNav = () => within(screen.getByRole("navigation", { name: /stages/i }));

describe("app navigation", () => {
  it("reaches every stage and never shows the error boundary", async () => {
    render(<App />);

    // Journey (default redirect)
    expect(await screen.findByText(/five-stage decision engine/i)).toBeInTheDocument();

    fireEvent.click(stageNav().getByRole("link", { name: /Allocation/i }));
    expect(await screen.findByText(/Strategic asset allocation/i)).toBeInTheDocument();

    fireEvent.click(stageNav().getByRole("link", { name: /Goal/i }));
    expect(await screen.findByText(/Goal & SIP solver/i)).toBeInTheDocument();

    fireEvent.click(stageNav().getByRole("link", { name: /Screen/i }));
    expect(await screen.findByText(/Five-hurdle fund screener/i)).toBeInTheDocument();

    fireEvent.click(stageNav().getByRole("link", { name: /Diligence/i }));
    expect(await screen.findByText(/Portfolio due diligence/i)).toBeInTheDocument();

    // Stage 4 must have a forward CTA into Stage 5 (Synthesis).
    const cta = screen.getByRole("link", { name: /Proceed to Stage 5/i });
    expect(cta).toBeInTheDocument();
    fireEvent.click(stageNav().getByRole("link", { name: /Synthesis/i }));
    await waitFor(() => expect(window.location.hash).toBe("#/scenario"));
    expect((await screen.findAllByText(/What else could add value/i)).length).toBeGreaterThan(0);

    fireEvent.click(stageNav().getByRole("link", { name: /Data/i }));
    expect(await screen.findByText(/What is real, and what is assumed/i)).toBeInTheDocument();

    expect(screen.queryByText(/Something went wrong/i)).toBeNull();
  }, 30_000);

  it("a direct hash load renders the deep route (refresh on /#/screener)", async () => {
    window.location.hash = "#/screener";
    render(<App />);
    expect(await screen.findByText(/Five-hurdle fund screener/i)).toBeInTheDocument();
  }, 20_000);

  it("Stage 4 CTA navigates forward into Stage 5", async () => {
    render(<App />);
    await screen.findByRole("navigation", { name: /stages/i });
    fireEvent.click(stageNav().getByRole("link", { name: /Diligence/i }));
    await screen.findByText(/Portfolio due diligence/i);
    fireEvent.click(screen.getByRole("link", { name: /Proceed to Stage 5/i }));
    await waitFor(() => expect(window.location.hash).toBe("#/scenario"));
    expect((await screen.findAllByText(/What else could add value/i)).length).toBeGreaterThan(0);
  }, 30_000);

  it("Stage 4 review-allocation returns to Stage 1 without losing state (your example)", async () => {
    // Seed a distinctive allocation, then prove it survives the round trip.
    useProfile.setState((s) => ({ weights: { ...s.weights, gold: 17 } }));
    const goldBefore = useProfile.getState().weights.gold;

    render(<App />);
    await screen.findByRole("navigation", { name: /stages/i });
    fireEvent.click(stageNav().getByRole("link", { name: /Diligence/i }));
    expect(await screen.findByText(/Portfolio due diligence/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Review Stage 1 allocation/i }));
    expect(await screen.findByText(/Strategic asset allocation/i)).toBeInTheDocument();

    // State is intact after navigating back to Stage 1.
    expect(useProfile.getState().weights.gold).toBe(goldBefore);

    // And forward again still works.
    fireEvent.click(stageNav().getByRole("link", { name: /Diligence/i }));
    expect(await screen.findByText(/Portfolio due diligence/i)).toBeInTheDocument();
  }, 20_000);
});
