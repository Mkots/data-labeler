import csvToJson from 'convert-csv-to-json';

let fileInputName = './data.csv'; 
let fileOutputName = './data.json';

csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName,fileOutputName);