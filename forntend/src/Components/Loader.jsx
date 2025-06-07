import React from 'react';

const Loader = ({
  width='w-6',
  height='h-6'
}) => {
  return (
      <div className={`border-2 border-gray-300 border-t-gray-500 border-solid rounded-full ${width} ${height} animate-spin`}></div>
  );
};

export default Loader;
