import Link from 'next/link';

const AppLogo = (): JSX.Element => (
  <Link href="/">
    <a className="app-logo-link">
      <svg
        id="ed08f62a-a2c8-4335-8966-dac5e3578e3f"
        data-name="Calque 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32.84 75.83"
      >
        <circle cx="4.67" cy="41.15" r="4.67" style={{ fill: '#000' }} />
        <circle cx="26.07" cy="41.15" r="4.67" style={{ fill: '#000' }} />
        <path
          d="M31.82,58.21c0,11.18,10.18,20.22,22.77,20.22"
          transform="translate(-27.15 -4.61)"
          style={{
            fill: 'none',
            stroke: '#000',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '4px',
          }}
        />
        <line
          x1="5.72"
          y1="2"
          x2="30.68"
          y2="2"
          style={{
            fill: 'none',
            stroke: '#000',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '4px',
          }}
        />
        <line
          x1="2.33"
          y1="28.69"
          x2="27.28"
          y2="28.69"
          style={{
            fill: 'none',
            stroke: '#000',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '4px',
          }}
        />
        <path
          d="M32.87,6.61c0,13-1.82,26.69-3.55,26.69"
          transform="translate(-27.15 -4.61)"
          style={{
            fill: 'none',
            stroke: '#000',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '4px',
          }}
        />
        <path
          d="M58,6.61c0,13-1.83,26.69-3.56,26.69"
          transform="translate(-27.15 -4.61)"
          style={{
            fill: 'none',
            stroke: '#000',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '4px',
          }}
        />
      </svg>

      <style jsx>{`
        a {
          margin: 20px auto;
          width: 72px;
          height: 72px;
          border-radius: 40px;
          border: 3px solid black;
          background-color: #feff9c;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        svg {
          width: 52px;
          height: 52px;
        }
      `}</style>
    </a>
  </Link>
);

export default AppLogo;
