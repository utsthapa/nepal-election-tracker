# Cute Modes - Quick Reference

## What is this feature?
Add 4 toggleable "cute modes" representing Nepali political factors that can be combined to simulate different electoral scenarios.

## The 4 Modes

| Mode | Icon | Political Figure | Effect | Description |
|------|------|------------------|--------|-------------|
| **Balen Factor** | 👓 | Balen Shah (Kathmandu Mayor) | +8% RSP, -4% NC, -4% UML | Populist appeal, youth magnet |
| **Rabi Factor** | 🔔 | Rabi Lamichhane (RSP Leader) | +6% RSP, -3% NC, -3% UML | TV personality, charismatic |
| **Oli Disaster** | 💥 | K.P. Oli (UML Leader) | -7% UML, +7% RSP | Anti-incumbency wave |
| **Deuba Disaster** | 🌪️ | Sher Bahadur Deuba (NC Leader) | -6% NC, +6% RSP | Traditional politics fatigue |

## How it Works

1. **Toggle modes**: Click mode buttons to activate/deactivate
2. **Combine effects**: Multiple modes can be active simultaneously
3. **Vote adjustments**: Effects stack additively (e.g., +6% + +5% = +11%)
4. **Auto-normalization**: Votes automatically re-normalize to maintain 100% total
5. **Apply to both**: Affects both FPTP (165 seats) and PR (110 seats)

## Example Scenarios

### Scenario 1: Youth Wave
**Active Modes**: Balen Factor
**Result**: RSP +8%, NC -4%, UML -4%

### Scenario 2: Anti-Incumbency
**Active Modes**: Oli Disaster
**Result**: UML -7%, RSP +7%

### Scenario 3: RSP Surge
**Active Modes**: Balen Factor + Rabi Factor
**Result**: RSP +14%, NC -7%, UML -7%

### Scenario 4: Chaos Mode
**Active Modes**: All 4 modes
**Result**: Complex redistribution with multiple parties affected

## UI Placement

The mode toggles will appear **above the FPTP/PR sliders** in the main page layout, making them easily accessible before adjusting vote shares.

## Technical Implementation

### Files to Create
1. `src/data/modes.js` - Mode configuration data
2. `src/components/FactorModes.jsx` - UI component with toggle buttons

### Files to Modify
1. `src/hooks/useElectionState.js` - Add mode state management
2. `src/utils/calculations.js` - Add mode adjustment logic
3. `app/page.jsx` - Integrate FactorModes component

## Key Features

✅ **Stackable**: Multiple modes can be active at once
✅ **Additive**: Effects add up mathematically
✅ **Constrained**: Votes clamped between 0.5% and 60%
✅ **Normalized**: Always sums to 100%
✅ **Visual**: Active modes shown with indicators
✅ **Reset**: Clear all modes with reset button

## Vote Adjustment Logic

```
adjustedVote = baseVote + Σ(modeEffects)

After applying all mode effects:
1. Clamp each party between 0.5% and 60%
2. Re-normalize to sum to 100%
```

## Testing Checklist

- [ ] Toggle individual modes on/off
- [ ] Combine multiple modes
- [ ] Verify vote share calculations
- [ ] Check seat count changes
- [ ] Test reset functionality
- [ ] Verify normalization works correctly
- [ ] Test edge cases (all modes, conflicting effects)

## Next Steps

1. Review this plan
2. Switch to Code mode to implement
3. Test the implementation
4. Iterate based on feedback
