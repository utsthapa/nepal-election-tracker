# Simulator UI Cleanup Plan

## Overview
This plan outlines changes to clean up the Nepal Election Simulator UI by removing unused elements and improving clarity of existing controls.

## Changes Required

### 1. Remove Unused Props from BayesianControlPanel
**File:** `components/BayesianControlPanel.jsx`

**Current Props (lines 4-14):**
```jsx
export function BayesianControlPanel({
  activeSignals = [],
  onToggleSignal,
  onAddPreset,
  incumbencyDecay,
  onIncumbencyChange,
  useRSPProxy = true,
  onUseRSPProxyChange,
  iterationCount,
  onApply,
})
```

**Action:** Keep only the props that are actually used in the component:
- `activeSignals` - Used (line 51)
- `onToggleSignal` - Used (line 57)
- `onAddPreset` - Used (line 43)
- `incumbencyDecay` - Used (line 83)
- `onIncumbencyChange` - Used (line 84)
- `useRSPProxy` - Used (line 99)
- `onUseRSPProxyChange` - Used (line 97)
- `iterationCount` - Used (line 25)
- `onApply` - Used (line 28)

**Props to Remove (currently passed but not used):**
- `prMethod` - Not used in component
- `onPrMethodChange` - Not used in component
- `stabilityIndex` - Not used in component
- `femaleQuota` - Not used in component
- `majorityProb` - Not used in component
- `leadingParty` - Not used in component

### 2. Update Simulator Page to Remove Unused Prop Passing
**File:** `app/simulator/page.jsx`

**Current Code (lines 368-384):**
```jsx
<BayesianControlPanel
  activeSignals={activeSignals}
  onToggleSignal={toggleSignal}
  onAddPreset={addRecentSignal}
  incumbencyDecay={incumbencyDecay}
  onIncumbencyChange={setIncumbencyDecay}
  useRSPProxy={useRSPProxy}
  onUseRSPProxyChange={setUseRSPProxy}
  prMethod={prMethod}              // REMOVE
  onPrMethodChange={setPrMethod}    // REMOVE
  iterationCount={iterationCount}
  stabilityIndex={stabilityIndex}    // REMOVE
  femaleQuota={femaleQuota}         // REMOVE
  majorityProb={majorityProb}        // REMOVE
  leadingParty={leadingParty}        // REMOVE
  onApply={handleApplySimulationControls}
/>
```

**Action:** Remove the marked props from the component call.

### 3. Rename Incumbency Decay to "Frustration Slider"
**File:** `components/BayesianControlPanel.jsx`

**Current Section (lines 70-88):**
```jsx
{/* Incumbency decay */}
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <p className="text-xs font-mono text-gray-500 flex items-center gap-2">
      <Zap className="w-4 h-4 text-amber-300" /> Incumbency decay
    </p>
    <span className="text-xs text-gray-300">{Math.round(incumbencyDecay * 100)}% frustration</span>
  </div>
  <input
    type="range"
    min="0"
    max="1.0"
    step="0.01"
    value={incumbencyDecay}
    onChange={(e) => onIncumbencyChange?.(parseFloat(e.target.value))}
    className="w-full accent-amber-400"
  />
  <p className="text-[11px] text-gray-500">Applies a win-probability haircut to 2022 winners. At 100%, incumbents lose 80% of their win probability advantage.</p>
</div>
```

**Action:** Update the label to make it clearer:
- Change "Incumbency decay" to "Frustration Slider"
- Keep the Zap icon
- Keep the percentage display showing "X% frustration"

### 4. Remove PR Allocation Method Text from Footer
**File:** `app/simulator/page.jsx`

**Current Footer (lines 498-512):**
```jsx
<footer className="mt-12 pt-6 border-t border-neutral">
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
    <div>
      <p className="font-mono">Nepal Election Simulator</p>
      <p className="text-xs mt-1">
        Based on 2022 General Election baseline data • 165 FPTP + 110 PR seats
      </p>
    </div>
    <div className="text-right">
      <p>Electoral System: Mixed Member Proportional</p>
      <p className="text-xs mt-1">
        PR allocation uses Sainte-Laguë method with 3% threshold
      </p>
    </div>
  </div>
</footer>
```

**Action:** Remove the "Electoral System" and "PR allocation uses..." section:
```jsx
<footer className="mt-12 pt-6 border-t border-neutral">
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
    <div>
      <p className="font-mono">Nepal Election Simulator</p>
      <p className="text-xs mt-1">
        Based on 2022 General Election baseline data • 165 FPTP + 110 PR seats
      </p>
    </div>
  </div>
</footer>
```

### 5. Verify RSP Proxy Expandable Functionality
**File:** `components/BayesianControlPanel.jsx`

**Current Implementation (lines 90-151):**
The RSP Proxy section is already expandable - when enabled, it shows detailed information about:
- Urban Growth Potential
- Demographic Matching
- Ghost Seat Projection

When disabled, it shows:
- Conservative Estimate message

**Action:** Verify this functionality works correctly. No changes needed unless issues are found.

## Summary of Changes

| File | Change | Lines |
|------|--------|-------|
| `components/BayesianControlPanel.jsx` | Remove unused props from function signature | 4-14 |
| `components/BayesianControlPanel.jsx` | Update "Incumbency decay" label to "Frustration Slider" | 73 |
| `app/simulator/page.jsx` | Remove unused props from BayesianControlPanel call | 376-381 |
| `app/simulator/page.jsx` | Remove PR allocation method text from footer | 507-511 |

## Testing Checklist
- [ ] Verify BayesianControlPanel renders without errors
- [ ] Verify frustration slider works correctly
- [ ] Verify RSP Proxy toggle and expansion works
- [ ] Verify Apply button still functions
- [ ] Verify no console errors
- [ ] Verify all existing functionality remains intact
