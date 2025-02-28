import {FormControl, Validators} from '@angular/forms';
import {getFormControlErrorMessage} from './form.utils';

describe('getFormControlErrorMessage', () => {

  let control: FormControl;

  it('should return null if control is valid', () => {
    control = new FormControl('validValue');
    control.markAsTouched();

    expect(getFormControlErrorMessage(control)).toBeNull();
  });

  it('should return required error message when control has required error', () => {
    control = new FormControl('', { validators: Validators.required });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'Este campo es obligatorio.' });
  });

  it('should return min length error message when control has minlength error', () => {
    control = new FormControl('abc', { validators: Validators.minLength(5) });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'Este campo debe tener un mínimo de 5 caracteres.' });
  });

  it('should return max length error message when control has maxlength error', () => {
    control = new FormControl('abcdef', { validators: Validators.maxLength(3) });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'Este campo debe tener un máximo de 3 caracteres.' });
  });

  it('should return pattern error message when control has pattern error', () => {
    const pattern = /^[a-z]+$/;
    control = new FormControl('12345', { validators: Validators.pattern(pattern) });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'El formato no es válido.' });
  });

  it('should return "Este campo debe ser un número." message when the control has numeric error', () => {
    const control = new FormControl('abc');
    control.setErrors({ numeric: true });
    control.markAsTouched();
    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'Este campo debe ser un número.' });
  });

  it('should return email error message when control has email error', () => {
    control = new FormControl('invalidEmail', { validators: Validators.email });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'El correo electrónico no es válido.' });
  });

  it('should return numeric error message when control has numeric error', () => {
    control = new FormControl('abc', { validators: Validators.pattern('^[0-9]+$') });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'El formato no es válido.' });
  });

  it('should return numericNegative error message when control has numericNegative error', () => {
    control = new FormControl(-5);
    control.setErrors({ numericNegative: true });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'El número no puede ser negativo.' });
  });

  it('should return requiredCollection error message when control has requiredCollection error', () => {
    control = new FormControl([], { validators: Validators.required });
    control.setErrors({ requiredCollection: { min: 3 } });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'La colección debe tener al menos 3 elementos.' });
  });

  it('should return numericScoreValueBiggerThanBase error message when control has numericScoreValueBiggerThanBase error', () => {
    control = new FormControl(2);
    control.setErrors({ numericScoreValueBiggerThanBase: { baseScore: 5 } });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'El valor debe ser mayor que 5.' });
  });

  it('should return numericScoreValueDecimalScale error message when control has numericScoreValueDecimalScale error', () => {
    control = new FormControl(3.1415);
    control.setErrors({ numericScoreValueDecimalScale: { expectedScale: 2 } });
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'El valor debe tener una escala decimal de 2.' });
  });

  it('should return generic error message if no specific error is found', () => {
    control = new FormControl('value');
    control.setErrors({});
    control.markAsTouched();

    const result = getFormControlErrorMessage(control);
    expect(result).toEqual({ message: 'Error genérico. Por favor, verifica la información ingresada.' });
  });

});
