import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-toast',
    imports: [
        NgClass
    ],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
})
export class ToastComponent {
    @Input() message: string | undefined;
    @Input() toastClass: string | undefined;
}
