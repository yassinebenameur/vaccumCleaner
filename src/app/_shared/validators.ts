import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const coordinatesAreInGrid: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {


    const coords = control.value.split(',');

    if (control.parent) {
        if (Number(coords[0]) > Number(control.parent.get('width').value)) {
            console.table([coords[0], control.parent.get('width').value]);

            return {X_IS_OUT_OF_GRID: true};
        }
        if (Number(coords[1]) > Number(control.parent.get('height').value)) {
            console.table([coords[1], control.parent.get('height').value]);

            return {Y_IS_OUT_OF_GRID: true};
        }
    }
    return null;
};
