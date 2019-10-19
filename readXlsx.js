const xlsx = require('xlsx');

let workBook = xlsx.readFile('C:/Users/Asus/Desktop/Book1.xlsx', {
  cellDates: true
});

let sheetName = workBook.SheetNames[0];

// let workSheet = workBook.Sheets[sheetName];

// let data = xlsx.utils.sheet_to_json(workSheet, {defval: ''});

// let newData = data.map(function(record) {
//   record.NGAYSINH.setDate(record.NGAYSINH.getDate() + 1);
//   return record;
// });

let data = workBook.SheetNames.map(function(sheet) {
  return xlsx.utils.sheet_to_json(workBook.Sheets[sheet], { defval: '' });
});

console.log(data);