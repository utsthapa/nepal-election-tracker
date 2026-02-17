'use client';

import { ChevronDown, ChevronUp, GitBranch } from 'lucide-react';
import { useState, useMemo } from 'react';

import { PARTIES } from '../data/constituencies';
import { calculateVoteFlows, toSankeyData } from '../utils/voteFlowCalculator';

const getPartyColor = (name) => PARTIES[name]?.color || '#6b7280';

/**
 * Custom SVG Sankey diagram for voter flows
 */
function SankeyDiagram({ nodes, links, width = 600, height = 350 }) {
  const padding = { top: 20, right: 100, bottom: 20, left: 100 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const nodeWidth = 16;
  const nodeGap = 6;

  // Separate sources and targets
  const sourceNames = [...new Set(links.map(l => nodes[l.source].name))];
  const targetNames = [...new Set(links.map(l => nodes[l.target].name))];

  // Calculate node heights based on total flow
  const sourceFlows = {};
  const targetFlows = {};
  links.forEach(l => {
    const sName = nodes[l.source].name;
    const tName = nodes[l.target].name;
    sourceFlows[sName] = (sourceFlows[sName] || 0) + l.value;
    targetFlows[tName] = (targetFlows[tName] || 0) + l.value;
  });

  const totalSourceFlow = Object.values(sourceFlows).reduce((a, b) => a + b, 0);
  const totalTargetFlow = Object.values(targetFlows).reduce((a, b) => a + b, 0);
  const availableHeight = innerHeight - (Math.max(sourceNames.length, targetNames.length) - 1) * nodeGap;

  // Position source nodes
  const sourcePositions = {};
  let sy = 0;
  sourceNames.forEach(name => {
    const h = Math.max(8, (sourceFlows[name] / totalSourceFlow) * availableHeight);
    sourcePositions[name] = { x: 0, y: sy, h };
    sy += h + nodeGap;
  });

  // Position target nodes
  const targetPositions = {};
  let ty = 0;
  targetNames.forEach(name => {
    const h = Math.max(8, (targetFlows[name] / totalTargetFlow) * availableHeight);
    targetPositions[name] = { x: innerWidth - nodeWidth, y: ty, h };
    ty += h + nodeGap;
  });

  // Calculate link paths with stacking
  const sourceOffsets = {};
  const targetOffsets = {};
  sourceNames.forEach(n => { sourceOffsets[n] = 0; });
  targetNames.forEach(n => { targetOffsets[n] = 0; });

  const linkPaths = links.map(l => {
    const sName = nodes[l.source].name;
    const tName = nodes[l.target].name;
    const sPos = sourcePositions[sName];
    const tPos = targetPositions[tName];

    const sHeight = (l.value / sourceFlows[sName]) * sPos.h;
    const tHeight = (l.value / targetFlows[tName]) * tPos.h;
    const linkHeight = Math.max(2, (sHeight + tHeight) / 2);

    const x0 = sPos.x + nodeWidth;
    const y0 = sPos.y + sourceOffsets[sName] + sHeight / 2;
    const x1 = tPos.x;
    const y1 = tPos.y + targetOffsets[tName] + tHeight / 2;

    sourceOffsets[sName] += sHeight;
    targetOffsets[tName] += tHeight;

    const cx = (x0 + x1) / 2;

    return {
      d: `M${x0},${y0} C${cx},${y0} ${cx},${y1} ${x1},${y1}`,
      strokeWidth: Math.max(1, linkHeight),
      sourceColor: getPartyColor(sName),
      targetColor: getPartyColor(tName),
      sourceName: sName,
      targetName: tName,
      value: l.value,
    };
  });

  const formatVotes = (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v;

  return (
    <svg width={width} height={height} className="w-full h-auto" viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${padding.left},${padding.top})`}>
        {/* Links */}
        {linkPaths.map((link, i) => (
          <path
            key={i}
            d={link.d}
            fill="none"
            stroke={link.sourceColor}
            strokeWidth={link.strokeWidth}
            strokeOpacity={0.35}
            className="hover:stroke-opacity-60 transition-all cursor-default"
          >
            <title>
              {PARTIES[link.sourceName]?.short || link.sourceName} → {PARTIES[link.targetName]?.short || link.targetName}: {formatVotes(link.value)} votes
            </title>
          </path>
        ))}

        {/* Source nodes */}
        {sourceNames.map(name => {
          const pos = sourcePositions[name];
          return (
            <g key={`s-${name}`}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={pos.h}
                fill={getPartyColor(name)}
                rx={3}
              />
              <text
                x={pos.x - 6}
                y={pos.y + pos.h / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-[11px] font-semibold fill-current"
                style={{ fill: getPartyColor(name) }}
              >
                {PARTIES[name]?.short || name}
              </text>
            </g>
          );
        })}

        {/* Target nodes */}
        {targetNames.map(name => {
          const pos = targetPositions[name];
          return (
            <g key={`t-${name}`}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={pos.h}
                fill={getPartyColor(name)}
                rx={3}
              />
              <text
                x={pos.x + nodeWidth + 6}
                y={pos.y + pos.h / 2}
                textAnchor="start"
                dominantBaseline="middle"
                className="text-[11px] font-semibold fill-current"
                style={{ fill: getPartyColor(name) }}
              >
                {PARTIES[name]?.short || name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function VoterFlowDiagram({ fptpResults }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [minFlowK, setMinFlowK] = useState(10);

  const flows = useMemo(
    () => calculateVoteFlows(fptpResults),
    [fptpResults]
  );

  const hasFlows = flows.length > 0 && flows.some(f => f.value > 1000);

  const sankeyData = useMemo(
    () => toSankeyData(flows, minFlowK * 1000),
    [flows, minFlowK]
  );

  return (
    <div className="bg-white rounded-lg border border-[rgb(219,211,196)] shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-teal-500" />
          <h3 className="font-semibold text-[rgb(24,26,36)]" style={{ fontFamily: 'Lora, serif' }}>
            Voter Flow
          </h3>
          {hasFlows && (
            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">
              {flows.length} flows
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {!hasFlows ? (
            <p className="text-sm text-[rgb(100,110,130)] text-center py-6">
              Move sliders away from baseline to see estimated voter flows between parties.
            </p>
          ) : (
            <>
              {/* Min flow filter */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-[rgb(100,110,130)] whitespace-nowrap">
                  Min flow
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={minFlowK}
                  onChange={(e) => setMinFlowK(parseInt(e.target.value))}
                  className="flex-1 h-1.5 accent-teal-500"
                />
                <span className="text-sm font-mono font-semibold text-[rgb(24,26,36)] w-12 text-right">
                  {minFlowK}K
                </span>
              </div>

              {/* Sankey diagram */}
              {sankeyData.nodes.length > 0 ? (
                <div className="overflow-x-auto">
                  <SankeyDiagram
                    nodes={sankeyData.nodes}
                    links={sankeyData.links}
                  />
                </div>
              ) : (
                <p className="text-sm text-[rgb(100,110,130)] text-center py-4">
                  No flows above {minFlowK}K votes. Try lowering the minimum.
                </p>
              )}

              {/* Top flows table */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[rgb(100,110,130)]">Top flows</p>
                {flows.slice(0, 5).map((flow, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="font-bold" style={{ color: getPartyColor(flow.source) }}>
                      {PARTIES[flow.source]?.short || flow.source}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-bold" style={{ color: getPartyColor(flow.target) }}>
                      {PARTIES[flow.target]?.short || flow.target}
                    </span>
                    <span className="font-mono text-[rgb(100,110,130)]">
                      {(flow.value / 1000).toFixed(0)}K votes
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
