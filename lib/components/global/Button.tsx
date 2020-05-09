import PropTypes from 'prop-types';
import LoadingIndicator from './LoadingIndicator';

const Button = ({ children, type, isLoading, onClick }): JSX.Element =>
  isLoading ? (
    <LoadingIndicator center={type !== 'submit'} />
  ) : (
    <button type={type} disabled={isLoading} onClick={onClick}>
      {children}

      <style jsx>{`
        button {
          margin: 0;
          padding: 9px;
          border: 3px solid black;
          border-radius: 9px;
          background: ${isLoading ? 'lightgray' : 'white'};
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          color: black;
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
