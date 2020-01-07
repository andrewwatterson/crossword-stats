import Styled from 'styled-components';

export const AppWrapper = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 100%;
  overflow: hidden;
`;

export const Form = Styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  min-width: 224px;

  padding: 24px 24px 48px 24px;

  input[type=text], input[type=date], input[type=password] {
    border: none;
    background-color: #EDF3FC;
    
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

export const SubmitButton = Styled.button`
  background-color: #4F85E5;
  color: white;
  padding: 12px 0px;
  border-radius: 3px;
  border: none;

  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  text-transform: uppercase;

  margin-top: 16px;
`;

export const Card = Styled.div`
  border-radius: 3px;
  margin: 0px 24px;
  max-width: 500px;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,.25);
`;