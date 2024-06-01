import { ISalesSeriesData } from '@/models/dashboard';
import { formatPrice } from '@/utils/currency';
import React from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// const data = [
//   {
//     name: 'Jan',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Feb',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Mar',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Apr',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'May',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Jun',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Jul',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Aug',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Sep',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Oct',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Nov',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: 'Dec',
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ];
interface IOverviewProps {
  data: ISalesSeriesData[];
}

// const CustomLabel = (props: any) => {
//   const { x, y, fill, value } = props;
//   if (!value) {
//     return null;
//   }
//   return (
//     <text x={x} y={y} dy={-4} fill={fill} fontSize={'12px'}>
//       {formatPrice(value, { maximumFractionDigits: 1 })}
//     </text>
//   );
// };
export const Overview: React.FC<IOverviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            `${formatPrice(value, { maximumFractionDigits: 0 })}`
          }
        />

        <Tooltip cursor={{ fill: '#f3f4f6' }} />
        <Bar
          dataKey="cash"
          stackId={'1'}
          // fill="#e5e7eb"
          // radius={[4, 4, 0, 0]}
          className="fill-gray-200"
          // label={<CustomLabel />}
        />
        <Bar
          stackId={'1'}
          dataKey="upi"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
          // label={<CustomLabel />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
