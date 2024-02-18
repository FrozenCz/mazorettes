import {Injectable} from '@angular/core';
import * as exceljs from 'exceljs';
import {XlsxUtils} from './utils';
import {Assignee, Category} from '../components/results/model';
import {DisciplineMap} from '../shared/model';

export interface CategoryResults {
  categories: CategoriesResult[]
}

export interface CategoriesResult {
  category: { uuid: string, name: string },
  assignees: Assignee[];
}

@Injectable({
  providedIn: 'root'
})
export class XlsxService {

  constructor() {
  }

  printResults(assignees: Assignee[]): void {

    // const book = xlsx.utils.book_new();
    const book = new exceljs.Workbook();
    const results: CategoryResults = {categories: []};
    assignees.forEach(assignee => {
      const categoryFound = results.categories.find(category => category.category.uuid === assignee.categoryUuid);
      if (categoryFound) {
        categoryFound.assignees.push(assignee);
      } else {
        results.categories.push({
          category: {uuid: assignee.categoryUuid, name: assignee.categoryName},
          assignees: [assignee]
        })
      }
    });
    results.categories.sort(((a, b) => a.category.name.localeCompare(b.category.name)))
    results.categories.forEach(category => {
      const sheet = book.addWorksheet('Kategorie - ' + category.category.name);
      sheet.columns = [{width: 5}, {width: 7}, {width: 7}, {width: 7}, {width: 60}]
      this.writeCategoryToSheet({
        sheet,
        runners: category.assignees,
        categoryName: 'Kategorie: ' + category.category.name
      })

      for (let i = 2; i <= category.assignees.length + 3; i++) {
        sheet.getRow(i).eachCell((cell, index) => {
          cell.border = {
            top: {style: 'thin', color: {argb: 'FF000000'}},
            bottom: {style: 'thin', color: {argb: 'FF000000'}},
            left: {style: 'thin', color: {argb: 'FF000000'}},
            right: {style: 'thin', color: {argb: 'FF000000'}}
          }
          if (i > 3) {
            cell.fill = {
              fgColor: {
                argb: i % 2 ? 'f6f6f6' : 'ffffff'
              },
              type: 'pattern',
              pattern: 'solid'
            }
          }
          cell.alignment = {
            vertical: 'middle',
            indent: 1,
            horizontal: 'left'
          }
          if (index === 2 || index === 3) {
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center'
            }
          }

          if (index === 6) {
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'right',
              indent: 1
            }
          }
        })
      }
    });

    XlsxUtils.publish(book, 'vysledky');

  }

  private writeCategoryToSheet(params: { categoryName: string; runners: Assignee[], sheet: exceljs.Worksheet }): void {
    const {categoryName, runners, sheet} = params;
    let ordNumber = 1;

    // runners.sort((a, b) => (a.time && b.time) ? (a.time - b.time) : 0 );
    runners.sort((a, b) => b.totalNumber - a.totalNumber);

    sheet.addRow([categoryName])
    sheet.addRow([]);
    sheet.addRow([null, 'Pořadí', 'S.Č.', 'Body', 'Účastníci']).eachCell(cell => {
      cell.style
      cell.fill = {fgColor: {argb: '2563EB'}, pattern: 'solid', type: 'pattern'}
      cell.font = {color: {argb: 'FFFFFF'}}
      cell.alignment = {
        vertical: 'middle'
      }
    })
    sheet.addRows(runners.map(runner => {
      return this.runnerItem(ordNumber++, runner)
    })).forEach(row => {
      row.height = 20;
    })


  }


  private runnerItem(ordNumber: number, runner: Assignee): any[] {
    return [null, ordNumber, runner.ordNumber, runner.totalNumber, runner.attendeeNote,];
  }

}
