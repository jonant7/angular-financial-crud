import { AbstractControl } from '@angular/forms';

export function getFormControlErrorMessage(control: AbstractControl): { message: string, params?: { [key: string]: string } } | null {
  if (!control || control.valid) {
    return null;
  }

  if (control.hasError('required') || control.hasError('requiredNotNull')) {
    return { message: 'Este campo es obligatorio.' };
  }

  if (control.hasError('min') || control.hasError('minlength')) {
    const min = control.errors['min'] ? control.errors['min'].min : control.errors['minlength'].requiredLength;
    return { message: `Este campo debe tener un mínimo de ${min} caracteres.` };
  }

  if (control.hasError('max') || control.hasError('maxlength')) {
    const max = control.errors['max'] ? control.errors['max'].max : control.errors['maxlength'].requiredLength;
    return { message: `Este campo debe tener un máximo de ${max} caracteres.` };
  }

  if (control.hasError('pattern')) {
    return { message: 'El formato no es válido.' };
  }

  if (control.hasError('email')) {
    return { message: 'El correo electrónico no es válido.' };
  }

  if (control.hasError('numeric')) {
    return { message: 'Este campo debe ser un número.' };
  }

  if (control.hasError('numericNegative')) {
    return { message: 'El número no puede ser negativo.' };
  }

  if (control.hasError('requiredCollection')) {
    return { message: `La colección debe tener al menos ${control.errors['requiredCollection'].min} elementos.` };
  }

  if (control.hasError('numericScoreValueBiggerThanBase')) {
    return {
      message: `El valor debe ser mayor que ${control.errors['numericScoreValueBiggerThanBase'].baseScore}.`
    };
  }

  if (control.hasError('numericScoreValueDecimalScale')) {
    return {
      message: `El valor debe tener una escala decimal de ${control.errors['numericScoreValueDecimalScale'].expectedScale}.`
    };
  }

  return { message: 'Error genérico. Por favor, verifica la información ingresada.' };
}
