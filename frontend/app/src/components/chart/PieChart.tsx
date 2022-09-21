import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';

interface PROPS {
  expenseItem: string[];
  costs: number[];
}

const PieChart: React.VFC<PROPS> = (props) => {
  const location = useLocation();

  const label = props.expenseItem.slice(0, 3);
  label[label.length] = '...';
  const list = location.pathname.includes('/accountBook/list');
  const home = location.pathname.includes('/accountBook/home');

  const pieChart = props.costs.length >= 1 && (
    <Pie
      data={{
        labels: list || home ? label : props.expenseItem,
        datasets: [
          {
            data: [...props.costs],
            backgroundColor: [
              'rgba(255, 51, 102, .8)',
              'rgba(255, 102, 102, 0.8)',
              'rgba(255, 153, 102, 0.8)',
              'rgba(255, 204, 102, 0.5)',
              'rgba(255, 102, 204, 0.5)',
              'rgba(255, 153, 255, 0.5)',
              'rgba(255, 204, 255, 0.5)',
              'rgba(204, 153, 255, 0.5)',
              'rgba(153, 153, 255, 0.5)',
              'rgba(153, 204, 255, 0.5)',
              'rgba(153, 255, 255, 0.5)',
              'rgba(102, 255, 153, 0.5)',
              'rgba(102, 255, 204, 0.5)',
              'rgba(204, 255, 102, 0.5)',
              'rgba(204, 255, 204, 0.5)',
            ],
            hoverBackgroundColor: [
              'rgba(255, 51, 102, .5)',
              'rgba(255, 102, 102, 0.5)',
              'rgba(255, 153, 102, 0.5)',
              'rgba(255, 204, 102, 0.3)',
              'rgba(255, 102, 204, 0.3)',
              'rgba(255, 153, 255, 0.3)',
              'rgba(255, 204, 255, 0.3)',
              'rgba(204, 153, 255, 0.3)',
              'rgba(153, 153, 255, 0.3)',
              'rgba(153, 204, 255, 0.3)',
              'rgba(153, 255, 255, 0.3)',
              'rgba(102, 255, 153, 0.3)',
              'rgba(102, 255, 204, 0.3)',
              'rgba(204, 255, 102, 0.3)',
              'rgba(204, 255, 204, 0.3)',
            ],
            borderColor: ['transparent', 'transparent', 'transparent'],
          },
        ],
      }}
    />
  );

  return <div>{pieChart}</div>;
};

export default PieChart;
