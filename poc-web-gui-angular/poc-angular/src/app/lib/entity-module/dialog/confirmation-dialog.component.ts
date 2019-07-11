import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {

  title: string;
  message: string;

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
    console.debug('Init ConfirmationDialogComponent')
  }


  cancel() {
    this.dialogRef.close({confirmed: false});
  }


  confirm() {
    this.dialogRef.close({confirmed: true});
  }
}
