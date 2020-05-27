import propTypes from 'prop-types';

import { useState, Dispatch } from 'react';
import Button from '../global/Button';

const useTextFieldForm = (
  onSubmit: Function
): [string, Dispatch<string>, Function, boolean] => {
  const [fieldValue, setFieldValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (): Promise<void> => {
    setIsLoading(true);
    onSubmit(fieldValue.trim());
  };

  return [fieldValue, setFieldValue, submit, isLoading];
};

const PromptForText = ({ fieldId, label, onSubmit }): JSX.Element => {
  const [fieldValue, setFieldValue, submit, isLoading] = useTextFieldForm(
    onSubmit
  );

  return (
    <form
      onSubmit={(event): void => {
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor={fieldId}>{label}</label>
      <input
        className="input-field"
        id={fieldId}
        name={fieldId}
        type="text"
        required
        minLength={1}
        autoFocus
        value={fieldValue}
        onChange={({ target: { value } }): void => {
          setFieldValue(value);
        }}
      />
      <Button type="submit" isLoading={isLoading}>
        Valider
      </Button>
    </form>
  );
};

PromptForText.propTypes = {
  fieldId: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
  onSubmit: propTypes.func.isRequired,
};

export default PromptForText;
