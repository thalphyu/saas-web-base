import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiservice: ApiService) { }
  public getCategory(check): Observable<any> {
    return this.apiservice.postJson(`/category/GetCategory`, check);
}
public SaveCategory(savecat: any): Observable<any> {
  return this.apiservice.postJson(`/category/SaveCategory/`, savecat);
}
deleteCategory(CategoryID: any) {
  return this.apiservice.postJson(
    `/category/DeleteCategory/`,
    CategoryID
  );
}
updateCategory(CategoryID) {
  return this.apiservice.postJson(
    `/category/UpdateCategory/`,
      CategoryID
  );
}
getCategoryByID(id) {
  const encryptdata = btoa(id);
  return this.apiservice.postJson( `/category/GetCategoryByID/` + encryptdata);
}
exportAsExcelFile(CategoryInformation, title1) {
  const title = title1;
  const header = [];
  // for (let i = 0; i < CategoryInformation.length; i++) {
  //   header.push(CategoryInformation[i].ImportColumnName);
  // }
  for(const i of CategoryInformation) {
    header.push(i.ImportColumnName);
  }
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Department Information');
  const headerRow = worksheet.addRow(header);
  for (let i = 0; i < headerRow.cellCount; i++) {
    const DefaultValue = CategoryInformation[i].DefaultValue;
    const headerRow1 = headerRow['_cells'][i];
    let color = '#000000';
    if (DefaultValue === '-1') {
      color = 'FF0000';
    }
    headerRow1.font = {
      color: { argb: color }
    };
    const j = i + 1;
    worksheet.getColumn(j).width = 20;
  }
  headerRow.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'CategoryInformation.xlsx');
  });
}

GetExcelColumn() {
  return this.apiservice.postJson('/category/GetCategoryExcelColumn');
}

getCategoryList(categorySet: any) {
  return this.apiservice.postJson('/category/GetMoreCategory/', categorySet);
}
}
