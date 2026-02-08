'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { constituencies, PARTIES } from '../data/constituencies'

const DISTRICT_ALIASES = {
  Chitawan: 'Chitwan',
  Kabhrepalanchok: 'Kavrepalanchok',
  Kapilbastu: 'Kapilvastu',
  Makawanpur: 'Makwanpur',
  Nawalparasi_E: 'Nawalpur',
  Nawalparasi_W: 'Nawalparasi West',
  Rukum_E: 'Rukum East',
  Rukum_W: 'Rukum West',
  Tanahu: 'Tanahun',
}

const normalizeDistrict = (raw) => {
  const base = (raw || '').replace(/_/g, ' ').trim()
  return DISTRICT_ALIASES[base] || base
}

const partyColor = (id) => {
  if (!id) return '#000000'
  const key = id.toLowerCase()
  return `var(--${key in { others: true } ? 'others' : key})`
}

const buildSeatLookup = () => {
  const map = new Map()
  constituencies.forEach((seat) => {
    map.set(seat.name.toLowerCase(), seat)
  })
  return map
}

const formatPct = (val) => `${(val * 100).toFixed(1)}%`

export default function NepalConstituencyMap() {
  const [features, setFeatures] = useState(null)
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)

  const seatLookup = useMemo(buildSeatLookup, [])

  useEffect(() => {
    let active = true
    fetch('/maps/geojson/constituencies.geojson')
      .then((res) => res.json())
      .then((data) => {
        if (active) setFeatures(data.features || [])
      })
      .catch((err) => console.error('Failed to load map', err))
    return () => {
      active = false
    }
  }, [])

  const { projection, pathGenerator } = useMemo(() => {
    if (!features?.length) return { projection: null, pathGenerator: null }
    const projection = geoMercator().fitSize([960, 600], {
      type: 'FeatureCollection',
      features,
    })
    return { projection, pathGenerator: geoPath(projection) }
  }, [features])

  const drawnFeatures = useMemo(() => {
    if (!features || !pathGenerator) return []
    return features.map((feature) => {
      const props = feature.properties || {}
      const district = normalizeDistrict(props.DISTRICT)
      const seatName = `${district} ${props.F_CONST}`.toLowerCase()
      const seat = seatLookup.get(seatName)
      return {
        feature,
        seat,
        seatName,
        district,
        path: pathGenerator(feature),
      }
    })
  }, [features, pathGenerator, seatLookup])

  const legendParties = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'US', 'JP', 'LSP', 'NUP', 'Others']

  return (
    <div className="relative w-full">
      <div className="flex items-start justify-between flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--color-muted))]">Interactive • House of Representatives</p>
          <h2 className="text-3xl font-display text-[#0f172a]">First-past-the-post constituencies</h2>
          <p className="text-[rgb(var(--color-muted))] max-w-2xl">
            Hover a constituency to see the 2022 winner, party color, and vote share. Boundaries come from the Election Commission&apos;s official GeoJSON feed;
            colors reflect the winning party in the 2022 general election.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {legendParties.map((id) => (
            <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-full border border-neutral bg-white shadow-sm">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: partyColor(id) }} />
              <span className="text-sm text-[#0f172a]">{PARTIES[id]?.name || id}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={svgRef}
        className="relative w-full overflow-hidden rounded-3xl border border-neutral bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
      >
        <svg viewBox="0 0 960 600" role="img" aria-label="Map of Nepal constituencies" className="w-full h-auto">
          <rect x="0" y="0" width="960" height="600" fill="#000000" />
          {drawnFeatures.map(({ feature, seat, district, path }, idx) => {
            const winner = seat?.winner2022
            const fill = seat ? partyColor(winner) : '#000000'
            const isHover = hover?.id === idx
            return (
              <path
                key={idx}
                d={path}
                fill={fill}
                fillOpacity={isHover ? 0.85 : 0.72}
                stroke="#111827"
                strokeOpacity={0.35}
                strokeWidth={0.35}
                className="transition duration-150 hover:cursor-pointer"
                onMouseEnter={(e) => {
                  if (!seat) return
                  const bounds = svgRef.current?.getBoundingClientRect()
                  setHover({
                    id: idx,
                    seat,
                    district,
                    x: e.clientX - (bounds?.left || 0) + 12,
                    y: e.clientY - (bounds?.top || 0) + 12,
                  })
                }}
                onMouseMove={(e) => {
                  if (!hover) return
                  const bounds = svgRef.current?.getBoundingClientRect()
                  setHover((prev) => prev && ({
                    ...prev,
                    x: e.clientX - (bounds?.left || 0) + 12,
                    y: e.clientY - (bounds?.top || 0) + 12,
                  }))
                }}
                onMouseLeave={() => setHover(null)}
              />
            )
          })}
        </svg>

        {hover && (
          <div
            className="absolute pointer-events-none w-72 max-w-[320px] rounded-2xl border border-neutral bg-white/95 shadow-xl backdrop-blur px-4 py-3"
            style={{ left: hover.x, top: hover.y }}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[rgb(var(--color-muted))]">{hover.district}</p>
            <h3 className="text-lg font-display text-[#0f172a]">{hover.seat.name}</h3>
            <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] mb-2">
              <span
                className="inline-flex h-3 w-3 rounded-full"
                style={{ backgroundColor: partyColor(hover.seat.winner2022) }}
              />
              <span>{PARTIES[hover.seat.winner2022]?.name || hover.seat.winner2022}</span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-[#9a3412]">
                Margin {formatPct(hover.seat.margin)}
              </span>
            </div>
            <div className="space-y-1">
              {Object.entries(hover.seat.results2022 || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([party, share]) => (
                  <div key={party} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: partyColor(party) }} />
                      <span className="text-[#0f172a]">{PARTIES[party]?.name || party}</span>
                    </div>
                    <span className="text-[rgb(var(--color-muted))]">{formatPct(share)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
