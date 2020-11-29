import {Component, OnInit} from '@angular/core';
import {AbstractControl, Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {delay} from './_shared/utils';
import {CellModel} from './_models/CellModel';
import {Direction} from './_models/Direction';
import {coordinatesAreInGrid} from './_shared/validators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})


export class AppComponent implements OnInit {
    constructor(private fb: FormBuilder) {
    }

    title = 'vaccumCleaner';

    cells: CellModel[] = [];
    active: {
        x: number;
        y: number;
        direction: string
    };
    direction = Direction;
    form: FormGroup;

    ngOnInit(): void {
        this.initializeFormGroup();
        if (this.form.valid) {
            this.calculateTiles();
            this.calculateInitialPosition();

        }
    }

    /**
     * Getter for form controls
     */
    get height(): AbstractControl {
        return this.form.get('height');
    }

    get width(): AbstractControl {
        return this.form.get('width');
    }

    get sequence(): AbstractControl {
        return this.form.get('sequence');
    }

    get initialPosition(): AbstractControl {
        return this.form.get('initialPosition');
    }

    /**
     * Form initialization
     */
    initializeFormGroup(): void {
        this.form = this.fb.group(
            {
                width: [
                    10, // initial value for demo
                    [
                        // validators
                        Validators.required,
                        Validators.pattern('[0-9]+'),
                        Validators.min(1),
                        Validators.max(30),
                    ],
                ],
                height: [
                    10, // initial value for demo
                    [
                        // validators
                        Validators.required,
                        Validators.pattern('[0-9]+'),
                        Validators.min(1),
                        Validators.max(30),
                    ],
                ],
                sequence: [
                    'DADADADAA', // initial value for demo
                    [
                        // validators
                        Validators.required,

                        // any combination of the three characters case insensitive
                        Validators.pattern(/^[DAG]+$/i)],
                ],
                initialPosition: [
                    '5,5,N', // initial value
                    [
                        // validators
                        Validators.required,

                        // digit, digit, one of the 4 characters case insensitive
                        Validators.pattern(/^\d+,\d+,[NEWS]$/i),
                        coordinatesAreInGrid,

                    ],

                ],


            },
            [{updateOn: blur}],
        );
        this.width.valueChanges.subscribe(elt => {
            if (this.width.valid && this.height.valid) {
                this.initialPosition.updateValueAndValidity();
                this.calculateTiles();
                if (this.initialPosition.valid) {
                    this.calculateInitialPosition();
                }
            }

        });
        this.height.valueChanges.subscribe(elt => {
            if (this.width.valid && this.height.valid) {
                this.initialPosition.updateValueAndValidity();

                this.calculateTiles();
                if (this.initialPosition.valid) {
                    this.calculateInitialPosition();
                }
            }
        });
        this.initialPosition.valueChanges.subscribe(elt => {
            if (this.width.valid && this.height.valid && this.initialPosition.valid) {
                this.calculateInitialPosition();
            }
        });
    }

    getY(index): number {
        return (this.height.value - Math.floor(index / this.width.value) - 1);
    }

    getX(index): number {
        return (index % this.width.value);
    }

    chooseCell(x: number, y: number): void {

        const index = (this.height.value - y - 1) * this.width.value + x;
        this.cells[index].active = !this.cells[index].active;
    }

    calculateTiles(): void {
        if (this.width.value < 1 || this.height.value < 1) {
            return;
        }

        this.cells = [];
        for (let i = 0; i < this.height.value * this.width.value; i++) {
            this.cells.push(new CellModel(i));
        }
    }

    calculateInitialPosition(): void {
        this.cells.forEach(cell => {
            cell.active = false;
        });
        const coords = this.initialPosition.value.split(',');
        console.log(coords);
        this.active = {
            x: Number(coords[0]),
            y: Number(coords[1]),
            direction: coords[2],
        };
        this.chooseCell(this.active.x, this.active.y);
    }

    refreshCurrentStatus(): void {
        this.cells.forEach(cell => {
            cell.active = false;
        });
        this.chooseCell(this.active.x, this.active.y);
    }

    async play(): Promise<void> {
        this.calculateInitialPosition();
        this.refreshCurrentStatus();
        await delay(1000);

        let sequencePlay = this.sequence.value;
        while (sequencePlay.length > 0) {
            console.log(sequencePlay[0]);
            const nextMove = sequencePlay[0];
            switch (nextMove.toUpperCase()) {
                case 'A': {
                    this.moveForward();
                    break;
                }
                case 'G': {
                    this.turnLeft();
                    break;
                }
                case 'D' : {
                    this.turnRight();
                    break;
                }
                default: {
                    alert('error: illegal move');
                }
            }

            sequencePlay = sequencePlay.substr(1);
            this.refreshCurrentStatus();
            await delay(1000);


        }

    }

    turnRight(): void {
        switch (this.active.direction) {
            case  Direction.NORTH: {
                this.active.direction = Direction.EAST;
                break;
            }
            case  Direction.EAST: {
                this.active.direction = Direction.SOUTH;
                break;
            }
            case  Direction.WEST: {
                this.active.direction = Direction.NORTH;
                break;
            }
            case  Direction.SOUTH: {
                this.active.direction = Direction.WEST;
                break;
            }
        }
    }

    turnLeft(): void {
        switch (this.active.direction) {
            case  Direction.NORTH: {
                this.active.direction = Direction.WEST;
                break;
            }
            case  Direction.EAST: {
                this.active.direction = Direction.NORTH;
                break;
            }
            case  Direction.WEST: {
                this.active.direction = Direction.SOUTH;
                break;
            }
            case  Direction.SOUTH: {
                this.active.direction = Direction.EAST;
                break;
            }
        }
    }

    moveForward(): void {
        switch (this.active.direction) {
            case  Direction.NORTH: {
                this.active.y = this.active.y + 1;
                break;
            }
            case  Direction.EAST: {
                this.active.x = this.active.x + 1;
                break;
            }
            case  Direction.WEST: {
                this.active.x = this.active.x - 1;
                break;
            }
            case  Direction.SOUTH: {
                this.active.y = this.active.y - 1;
                break;
            }
        }
    }
}


