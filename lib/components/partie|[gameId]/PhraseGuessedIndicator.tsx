const PhraseGuessedIndicator = (): JSX.Element => (
  <div className="wrapper">
    <svg
      id="eb41c9d6-cfac-4c13-9819-73625e2630fc"
      data-name="Calque 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20.21 25.2"
    >
      <line
        x1="2"
        y1="14.42"
        x2="9.53"
        y2="23.2"
        style={{
          fill: 'none',
          stroke: 'black',
          strokeLinecap: 'round',
          strokeMiterlimit: 10,
          strokeWidth: '4px',
        }}
      />
      <line
        x1="18.21"
        y1="2"
        x2="9.53"
        y2="23.2"
        style={{
          fill: 'none',
          stroke: 'black',
          strokeLinecap: 'round',
          strokeMiterlimit: 10,
          strokeWidth: '4px',
        }}
      />
    </svg>

    <style jsx>{`
      .wrapper {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        display: block;
        background-color: #76ff7a;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      svg {
        width: 20px;
        height: 20px;
      }
    `}</style>
  </div>
);

export default PhraseGuessedIndicator;
