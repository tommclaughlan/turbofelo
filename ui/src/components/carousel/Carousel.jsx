import React, { useState } from 'react';
import "./carousel.css"

const Carousel = ({items}) => {
  const [index, setIndex] = useState(0); 
  const length = 3;

  const handlePrevious = () => {
      const newIndex = index - 1;
      setIndex(newIndex < 0 ? length - 1 : newIndex);
  };

  const handleNext = () => {
    const newIndex = index + 1;
    setIndex(newIndex >= length ? 0 : newIndex);
  };

  return (
    <div className="carousel">
      <div className='columns has-text-weight-bold'>
        <div className='column is-one-fifth'>
          <button className=' button is-danger is-outlined is-rounded ' onClick={handlePrevious}>⇦</button>
        </div>
        <div className='column'>
          {items[index]}
        </div>
        <div className='column is-one-fifth next-button'>
          <button className=' button is-danger is-outlined is-rounded' onClick={handleNext}>⇨</button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;