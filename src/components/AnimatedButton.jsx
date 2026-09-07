import styled from 'styled-components';

export default function AnimatedButton({ children, large = false, onClick, type = 'button' }) {
  return (
    <StyledWrapper className={large ? 'large' : ''}>
      <button className="animated-button" type={type} onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="text">{children}</span>
        <span className="circle" />
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .animated-button {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 16px 36px;
    border: 4px solid;
    border-color: transparent;
    font-size: 16px;
    background-color: inherit;
    border-radius: 100px;
    font-weight: 600;
    color: #DC2B74;
    box-shadow: 0 0 0 2px #DC2B74;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button svg {
    position: absolute;
    width: 24px;
    fill: #DC2B74;
    z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .arr-1 {
    right: 16px;
  }

  .animated-button .arr-2 {
    left: -25%;
  }

  .animated-button .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: #DC2B74;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .text {
    position: relative;
    z-index: 1;
    transform: translateX(-12px);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button:hover {
    box-shadow: 0 0 0 12px transparent;
    color: #fff;
    border-radius: 12px;
  }

  .animated-button:hover .arr-1 {
    right: -25%;
  }

  .animated-button:hover .arr-2 {
    left: 16px;
  }

  .animated-button:hover .text {
    transform: translateX(12px);
  }

  .animated-button:hover svg {
    fill: #fff;
  }

  .animated-button:active {
    scale: 0.95;
    box-shadow: 0 0 0 4px white;
  }

  .animated-button:hover .circle {
    width: 220px;
    height: 220px;
    opacity: 1;
  }

  /* VARIANTE GRANDE (mesmo tamanho do botão do questionário) */
  &.large {
    width: 100%;
    max-width: 510px;
  }

  &.large .animated-button {
    width: 100%;
    height: 72px;
    padding: 0 40px;
    font-size: 25px;
    justify-content: center;
  }

  &.large .animated-button svg {
    width: 28px;
  }

  &.large .animated-button .arr-1 {
    right: 24px;
  }

  &.large .animated-button .arr-2 {
    left: -25%;
  }

  &.large .animated-button:hover .arr-1 {
    right: -25%;
  }

  &.large .animated-button:hover .arr-2 {
    left: 24px;
  }

  &.large .animated-button:hover .circle {
    width: 640px;
    height: 640px;
  }`;
