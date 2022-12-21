import { Component, OnInit } from '@angular/core';
import { WorksheetService } from 'src/app/services/worksheet.service';

@Component({
  selector: 'app-worksheet',
  templateUrl: './worksheet.component.html',
  styleUrls: ['./worksheet.component.css'],
})
export class WorksheetComponent implements OnInit {
  public worksheetList: any = [];
  public currentWorksheet: number = 0;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  progress: string = '0';
  isWorksheetsCompleted: boolean = false;
  worksheet2: boolean = false;
  questionPresent: boolean = true;
  worksheetsAttempted: number = this.correctAnswer + this.inCorrectAnswer;

  constructor(private worksheetService: WorksheetService) {}

  ngOnInit(): void {
    this.getAllWorksheets();
  }

  getAllWorksheets() {
    this.worksheetService.getWorksheetJson().subscribe((res) => {
      this.worksheetList = res.worksheets;
    });
  }

  nextWorksheet() {
    this.currentWorksheet++;
    this.getProgressPercent();
    if (this.currentWorksheet == this.worksheetList.length)
      this.isWorksheetsCompleted = true;
    this.checkWorksheet2();
    this.checkQuestionPresent();
  }

  previousWorksheet() {
    this.currentWorksheet--;
    this.checkWorksheet2();
    this.checkQuestionPresent();
    this.getProgressPercent();
  }

  answer(option: any) {
    if (option.correct) {
      this.correctAnswer++;
    } else {
      this.inCorrectAnswer++;
    }
  }

  resetWorksheets() {
    this.getAllWorksheets();
    this.currentWorksheet = 0;
    this.progress = '0';
  }

  getProgressPercent() {
    this.progress = (
      (this.currentWorksheet / this.worksheetList.length) *
      100
    ).toString();
    return this.progress;
  }

  checkQuestionPresent() {
    if (this.worksheetList[this.currentWorksheet].question1 == undefined) {
      this.questionPresent = false;
    } else {
      this.questionPresent = true;
    }
  }

  checkWorksheet2() {
    if (this.currentWorksheet == 1) {
      this.worksheet2 = true;
    } else {
      this.worksheet2 = false;
    }
  }
}
