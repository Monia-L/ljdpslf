import PropTypes from 'prop-types';

const Button = ({ children, type, isLoading, onClick }): JSX.Element => (
  <button type={type} disabled={isLoading} onClick={onClick}>
    {children}

    <style jsx>{`
      button {
        font-size: 18px;
        color: black;
        padding: 8px;
        margin: 0;
        border: 4px solid black;
        background: ${isLoading ? 'lightgray' : 'white'};
        font-weight: bold;
      }

      button:active {
        background: lightgray;
      }
    `}</style>
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  type: 'button',
  isLoading: false,
  onClick: (): void => {
    // Do nothing
  },
};

export default Button;
