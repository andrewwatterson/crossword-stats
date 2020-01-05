import Styled from 'styled-components';

export const AppWrapper = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FrontPageForm = Styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  min-width: 224px;

  padding: 24px 24px 48px 24px;

  input[type=text], input[type=password] {
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