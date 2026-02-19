'use client';

import { ArrowRightLeft } from 'lucide-react';

import { SwitchingMatrix } from './SwitchingMatrix';

export function AdvancedControls({
  demographicMode = false,
  overrideDemographics = false,
  onOverrideDemographicsChange,
  switchingMatrix = {},
  onUpdateSwitching,
  onApplySwitching,
  onClearSwitching,
  onOpenAlliance,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-800 mb-1">
          Advanced Settings
        </p>
        <h3 className="text-xl font-semibold text-white">2022 baseline + additive scenario changes</h3>
        <p className="text-sm text-gray-400 mt-2">
          Starting point is the 2022 base map. Add voter-flow links, then layer gathbandan to
          build your scenario incrementally.
        </p>
      </div>

      {demographicMode && (
        <div className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-2">
          <p className="text-xs text-amber-900">
            Demographics mode is active. Advanced controls won&apos;t affect FPTP outcomes unless
            you override it.
          </p>
          <label className="mt-2 flex items-center gap-2 text-xs text-amber-900">
            <input
              type="checkbox"
              checked={overrideDemographics}
              onChange={e => onOverrideDemographicsChange?.(e.target.checked)}
            />
            Override demographics when applying advanced controls
          </label>
        </div>
      )}

      <div className="rounded-lg border border-neutral bg-neutral/20 px-3 py-2">
        <p className="text-xs text-gray-700 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          Add multiple party-to-party flow rows. Keep adding links before applying.
        </p>
      </div>

      <SwitchingMatrix
        matrix={switchingMatrix}
        onChange={onUpdateSwitching}
        onApply={onApplySwitching}
        onClear={onClearSwitching}
        onOpenAlliance={onOpenAlliance}
      />
    </div>
  );
}

export default AdvancedControls;
