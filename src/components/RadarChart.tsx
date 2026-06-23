"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface RadarDataPoint {
  axis: string;
  value: number;
  max?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  benchmark?: RadarDataPoint[];
  size?: number;
  levels?: number;
  className?: string;
}

const axisColor = "#e6e6e6";
const fillColor = "rgba(0, 117, 222, 0.15)";
const strokeColor = "#0075de";
const benchmarkFillColor = "rgba(42, 157, 153, 0.1)";
const benchmarkStrokeColor = "#2a9d99";
const labelColor = "#615d59";

export default function RadarChart({
  data,
  benchmark,
  size = 280,
  levels = 5,
  className = "",
}: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = 50;
    const radius = Math.min(size, size) / 2 - margin;
    const centerX = size / 2;
    const centerY = size / 2;

    const allAxes = data.map((d) => d.axis);
    const totalAxes = allAxes.length;
    const angleSlice = (2 * Math.PI) / totalAxes;

    const maxValue = Math.max(...data.map((d) => d.max || 100), 100);

    const g = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`);

    // Background grid
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      g.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", axisColor)
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", level === levels ? "0" : "3,3");
    }

    // Axes
    const axes = g.selectAll(".axis")
      .data(allAxes)
      .enter()
      .append("g")
      .attr("class", "axis");

    axes.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (_d: string, i: number) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (_d: string, i: number) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", axisColor)
      .attr("stroke-width", 0.5);

    // Labels
    axes.append("text")
      .attr("x", (_d: string, i: number) => (radius + 14) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (_d: string, i: number) => (radius + 14) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("text-anchor", (_d: string, i: number) => {
        const angle = angleSlice * i;
        if (angle < 0.1 || angle > 2 * Math.PI - 0.1) return "middle";
        if (angle < Math.PI) return "start";
        return "end";
      })
      .attr("dy", "0.35em")
      .attr("font-size", "9px")
      .attr("fill", labelColor)
      .text((d: string) => d.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()));

    // Helper: get coordinates
    const getPoint = (value: number, index: number) => {
      const r = (value / maxValue) * radius;
      const angle = angleSlice * index - Math.PI / 2;
      return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
    };

    // Draw data polygon
    if (data.length) {
      const points = data.map((d, i) => getPoint(d.value, i));
      const lineGen = d3.line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinearClosed);

      g.append("path")
        .datum(points)
        .attr("d", lineGen)
        .attr("fill", fillColor)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.8);

      // Data circles
      g.selectAll(".data-circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", (d: { x: number; y: number }) => d.x)
        .attr("cy", (d: { x: number; y: number }) => d.y)
        .attr("r", 3)
        .attr("fill", strokeColor);
    }

    // Draw benchmark polygon
    if (benchmark?.length) {
      const benchPoints = benchmark.map((d, i) => getPoint(d.value, i));
      const lineGen = d3.line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinearClosed);

      g.append("path")
        .datum(benchPoints)
        .attr("d", lineGen)
        .attr("fill", benchmarkFillColor)
        .attr("stroke", benchmarkStrokeColor)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,3")
        .attr("opacity", 0.7);

      // Benchmark circles
      g.selectAll(".bench-circle")
        .data(benchPoints)
        .enter()
        .append("circle")
        .attr("cx", (d: { x: number; y: number }) => d.x)
        .attr("cy", (d: { x: number; y: number }) => d.y)
        .attr("r", 2.5)
        .attr("fill", benchmarkStrokeColor);
    }
  }, [data, benchmark, size, levels]);

  if (!data.length) return null;

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      className={className}
      style={{ display: "block" }}
    />
  );
}
