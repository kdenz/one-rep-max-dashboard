/**
 * This is a reusable chart component which uses recharts(react wrapper of d3.js)
 * It's specifically for displaying historical 1RM data for one exercise
 * in the form of a line + area chart
 */
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
import { formatDate } from "utils/date";

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
  margin-bottom: 15px;
`;

export interface OneRepMaxChartProps {
  highest1RM: number;
  data: { date: string; value: number }[];
}
export const OneRepMaxChart: React.FC<OneRepMaxChartProps> = memo(
  ({ data, highest1RM }) => (
    <>
      <TitleBar>
        <div>One Rep Max</div>
        <div>{highest1RM.toFixed(2)}</div>
      </TitleBar>
      <SubTitleBar>
        <div>Theoretical upper limit</div>
        <div>lbs</div>
      </SubTitleBar>
      <ResponsiveContainer width="90%" height={300}>
        <AreaChart data={data} margin={{ top: 20, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="30%" stopColor={theme.graph} stopOpacity={1} />
              <stop offset="100%" stopColor="transparent" />
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
            dataKey="date"
            tickSize={20}
            tickMargin={6}
            stroke={theme.grey["100"]}
            tick={{ fill: theme.white, fontSize: "13px" }}
            tickFormatter={date => formatDate(date)}
          />
          <YAxis
            orientation="left"
            unit=" lbs"
            tickSize={20}
            tickMargin={6}
            stroke={theme.grey["100"]}
            tick={{ fill: theme.white, fontSize: "13px" }}
            tickFormatter={weight => Math.round(weight)}
            type="number"
            domain={[160, 210]}
          />
          <CartesianGrid stroke={theme.grey["100"]} />
          <Tooltip
            formatter={value =>
              typeof value === "number" ? value.toFixed(2) : value
            }
            labelFormatter={label => formatDate(label.toString(), true)}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
);
