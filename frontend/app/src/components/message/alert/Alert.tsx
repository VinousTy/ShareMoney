import React from 'react';

interface ALERT {
  title: string;
  message: string;
}

const Alert = (props: ALERT) => {
  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8"
      role="alert"
    >
      <p className="font-bold">{props.title}</p>
      <p className="text-left md:ml-8">{props.message}</p>
    </div>
  );
};

export default Alert;
