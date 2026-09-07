import styled from 'styled-components';
import { LogOut } from 'lucide-react';

export default function LogoutConfirm({ onConfirm, onCancel }) {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="header">
          <div className="image">
            <LogOut size={22} strokeWidth={2} />
          </div>
        </div>

        <div className="content">
          <span className="title">BabyBuddy</span>
          <p className="message">Tem certeza que deseja sair da conta?</p>
        </div>

        <div className="actions">
          <button className="history" type="button" onClick={onConfirm}>Sim</button>
          <button className="track" type="button" onClick={onCancel}>Não</button>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    overflow: hidden;
    position: relative;
    text-align: left;
    border-radius: 0.5rem;
    width: min(440px, 92vw);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    background-color: #fff;
  }

  .dismiss {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    background-color: #fff;
    color: black;
    border: 2px solid #D1D5DB;
    font-size: 1rem;
    font-weight: 300;
    width: 30px;
    height: 30px;
    border-radius: 7px;
    transition: .3s ease;
  }

  .dismiss:hover {
    background-color: #ee0d0d;
    border: 2px solid #ee0d0d;
    color: #fff;
  }

  .header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .image {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #fbdce8;
    color: #DC2B74;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
  }

  .content {
    margin-top: 0.75rem;
    padding: 0 1.5rem;
    text-align: center;
  }

  .title {
    color: #DC2B74;
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.6rem;
  }

  .message {
    margin-top: 0.15rem;
    color: #595b5f;
    font-size: 1rem;
    line-height: 1.4rem;
  }

  .actions {
    margin: 0.75rem 1.5rem 1.5rem;
  }

  .history {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #DC2B74;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 1rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .track {
    display: inline-flex;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    color: #242525;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 1rem;
    border: 1px solid #D1D5DB;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }`;
