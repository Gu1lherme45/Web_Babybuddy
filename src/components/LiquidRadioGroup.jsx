import { Fragment } from 'react';
import styled from 'styled-components';

export default function LiquidRadioGroup({ name, options, value, onChange }) {
  const selectedIndex = options.indexOf(value);

  return (
    <StyledWrapper>
      <div
        className="liquid-group"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map((opt, index) => (
          <Fragment key={opt}>
            <input
              type="radio"
              id={`${name}-${index}`}
              name={name}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <label htmlFor={`${name}-${index}`}>{opt}</label>
          </Fragment>
        ))}

        <div
          className="liquid-slider"
          style={{
            width: `calc(${100 / options.length}% - var(--gap))`,
            opacity: selectedIndex === -1 ? 0 : 1,
            transform: `translateX(${
              selectedIndex === -1 ? 0 : selectedIndex * 100
            }%)`,
          }}
        />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;

  /* ===============================
     CONTAINER
  ================================= */
  .liquid-group {
    --gap: 4px;
    --radius: 14px;
    --speed: 0.55s;
    --ease: cubic-bezier(0.22, 0.9, 0.25, 1);

    position: relative;
    display: grid;
    width: 100%;
    background: #fdf1f5;
    padding: var(--gap);
    border-radius: var(--radius);
    border: 1px solid #DC2B74;
    margin: 4px 0 0;
    overflow: hidden;
  }

  /* ===============================
     INPUT (hidden acessível)
  ================================= */
  .liquid-group input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* ===============================
     LABELS
  ================================= */
  .liquid-group label {
    position: relative;
    z-index: 2;
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.3px;
    color: #333;
    cursor: pointer;
    white-space: nowrap;
    text-align: center;

    transition:
      color 0.35s ease,
      transform 0.2s ease;
  }

  /* micro feedback */
  .liquid-group label:active {
    transform: scale(0.97);
  }

  /* texto ativo */
  .liquid-group input:checked + label {
    color: #fff;
  }

  /* ===============================
     SLIDER (LIQUID)
  ================================= */
  .liquid-slider {
    position: absolute;
    inset: var(--gap);
    border-radius: calc(var(--radius) - 4px);
    background: #DC2B74;
    z-index: 1;

    transition:
      transform var(--speed) var(--ease),
      opacity 0.3s ease,
      background 0.3s ease;
  }

  /* brilho interno */
  .liquid-slider::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.06),
      inset 0 -1px 2px rgba(0, 0, 0, 0.6);
  }
`;
