import Styled from 'styled-components';
import * as Stz from '../../style.js';

export const AppWrapper = Styled.div`
  max-width: 100%;
  overflow: hidden;
`;

export const AppContent = Styled.div`
  padding-top: 72px;
  padding-bottom: 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 100vh;
  box-sizing: border-box;
`;

export const Form = Styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  min-width: 224px;

  padding: 24px 24px 48px 24px;

  input[type=text], input[type=date], input[type=password] {
    border: none;
    background-color: ${Stz.colors.lightBlue};
    
    font-size: 20px;
    line-height: 32px;
    padding: 8px 12px;
  }
`;

export const InputGroup = Styled.div`
  margin-bottom: 16px;

  label, input { display: block; }

  input { width: 100%; box-sizing: border-box; }

  label {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 8px;
  }
`;

export const Button = Styled.button`
  background-color: ${Stz.colors.white};
  color: ${Stz.colors.blue};
  border: 1px solid ${Stz.colors.blue};

  padding: 12px 0px;
  border-radius: 3px;

  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  text-transform: uppercase;

  margin-top: 16px;

  &[disabled] {
    opacity: .75;
  }
`;

export const SubmitButton = Styled(Button)`
  background-color: ${Stz.colors.blue};
  color: white;

  margin-top: 16px;
`;

export const FormError = Styled.div`
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 20px;

  color: ${Stz.colors.red}
`;

export const Card = Styled.div`
  border-radius: ${Stz.radius.card};
  margin: 0px 24px;
  
  max-width: 440px;
  width: 100vw;

  box-shadow: ${Stz.shadows.card};
`;