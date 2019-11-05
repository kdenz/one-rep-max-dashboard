import React, { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import styled from "styled-components";

import { theme } from "styles/theme";

const barCommonStyle = `
  display: flex;
  justify-content: space-between;
  margin-right: 10%;
`;
const TitleBar = styled.div`
  ${barCommonStyle}
  font-weight: bold;
  font-size: 20px;
  color: ${p => p.theme.white};
  margin-top: 64px;
`;
const SubTitleBar = styled.div`
  ${barCommonStyle}
  font-size: 13px;
  color: ${p => p.theme.grey["500"]};
  margin-top: 5px;
`;

export interface OneRepMaxChartProps {
  data: { name: string; value: number }[];
}
export const OneRepMaxChart: React.FC<OneRepMaxChartProps> = memo(
  ({ data }) => (
    <>
      <TitleBar>
        <div>One Rep Max</div>
        <div>215.10</div>
      </TitleBar>
      <SubTitleBar>
        <div>Theoretical upper limit</div>
        <div>lbs</div>
      </SubTitleBar>
      <ResponsiveContainer width="90%" height={300}>
        <AreaChart data={data} margin={{ top: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.graph} stopOpacity={1} />
              <stop offset="95%" stopColor="transparent" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <Area
            type="linear"
            dataKey="value"
            stroke={theme.graph}
            strokeWidth="3"
            fill="url(#colorUv)"
            isAnimationActive={false}
          />
          <XAxis
            dataKey="name"
            tickSize={20}
            tickMargin={6}
            stroke={theme.grey["100"]}
            tick={{ fill: theme.white, fontSize: "13px" }}
          />
          <YAxis
            orientation="left"
            unit=" lbs"
            tickSize={20}
            tickMargin={6}
            stroke={theme.grey["100"]}
            tick={{ fill: theme.white, fontSize: "13px" }}
            type="number"
            domain={[160, 210]}
          />
          <CartesianGrid stroke={theme.grey["100"]} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
);
