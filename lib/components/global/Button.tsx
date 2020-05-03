import PropTypes from 'prop-types';
import LoadingIndicator from './LoadingIndicator';

const Button = ({ children, type, isLoading, onClick }): JSX.Element =>
  isLoading ? (
    <LoadingIndicator />
  ) : (
    <button type={type} disabled={isLoading} onClick={onClick}>
      {children}

      <style jsx>{`
        button {
          font-size: 16px;
          color: black;
          padding: 9px;
          margin: 0;
          border: 3px solid black;
          background: ${isLoading ? 'lightgray' : 'white'};
          font-weight: bold;
          text-transform: uppercase;
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
