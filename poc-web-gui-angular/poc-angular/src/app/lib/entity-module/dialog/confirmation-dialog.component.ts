import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {

  title: string;
  message: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
    console.debug('Initialize ConfirmationDialogComponent')
  }


  cancel() {
    this.dialogRef.close({confirmed: false});
  }


  confirm() {
    this.dialogRef.close({confirmed: true});
  }
}
