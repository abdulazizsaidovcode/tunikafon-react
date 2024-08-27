import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useGet from '../../hooks/get';

interface ChartThreeState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartThree: React.FC = ({ month, year }) => {
  const { get, data } = useGet();

  const options: ApexOptions = {
    series: [
      {
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: data && data.map((item: any) => item.groupName),
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val;
        },
      },
    },
  };

  useEffect(() => {
    get(`/dashboard/group/statistic?year=${year}&month=${month}`);
  }, [month, year]);

  const [state, setState] = useState<ChartThreeState>({
    series: [
      {
        name: 'Iconma',
        data: (data && data.map((item: any) => item.income)) || [0],
      },
      {
        name: 'Rejected Income',
        data: (data && data.map((item: any) => item.rejectedIncome)) || [0],
      },
    ],
  });

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default xl:col-span-5">
      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            width={700}
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
