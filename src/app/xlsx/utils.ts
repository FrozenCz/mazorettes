import * as exceljs from 'exceljs';

export abstract class XlsxUtils {

  public static publish(wb: exceljs.Workbook, name: string): void {
    wb.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.sreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.href = url;
      a.download = name + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

}
