import React from 'react';
import PropTypes from 'prop-types';
import './box.css';

const Box = (props) => {
  const boxClasses = ['box'];
  if (props.hasBait) {
    boxClasses.push('hasBait');
  }
  else if (props.hasSnake) {
    boxClasses.push('hasSnake');
  }
  if (props.isHead) {
    boxClasses.push('isHead');
  }
  return <div className={boxClasses.join(' ')}></div>;
};

Box.propTypes = {
  hasSnake: PropTypes.bool,
  xCoord: PropTypes.number,
  yCoord: PropTypes.number,
  hasBait: PropTypes.bool,
  isHead: PropTypes.bool,
};

export default Box;
