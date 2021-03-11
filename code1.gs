function createNewGoogleDocs(e) {
  var answers = e.values;
  //This value should be the id of your document template
  const googleDocTemplate = DriveApp.getFileById('xxXXXxx'); 
  
  //This value should be the id of the folder where you want your completed documents stored
  const destinationFolder = DriveApp.getFolderById('xxXXXxx')

  Utilities.sleep(500);

  var spreadsheetUrl = "xxXXXxx";
  //Here we store the sheet as a variable
  const sheet = SpreadsheetApp.openByUrl(spreadsheetUrl).getSheets()[0];

  

  //Using the row data in a template literal, we make a copy of our template document in our destinationFolder
  const copy = googleDocTemplate.makeCopy(`${answers[4]} ${answers[5]} Заявление на ЕПД` , destinationFolder)
  //Once we have the copy, we then open it using the DocumentApp
  const doc = DocumentApp.openById(copy.getId())
  //All of the content lives in the body, so we get that for editing
  const body = doc.getBody();
  
  //In these lines, we replace our replacement tokens with values from our spreadsheet row
  body.replaceText('{{Year}}', '20' + answers[1]);
  body.replaceText('{{Spec}}', answers[2]);
  body.replaceText('{{Fac}}', answers[3]);
  body.replaceText('{{Surname Rus}}', answers[4]);
  body.replaceText('{{Name Rus}}', answers[5]);

  if (answers[6] === '-') {
    body.replaceText('{{Patronymic Rus}}', '');
  }
  else {
    body.replaceText('{{Patronymic Rus}}', answers[6]);
  }

  body.replaceText('{{Phone}}', answers[7]);
  body.replaceText('{{email}}', answers[8]);
  body.replaceText('{{Surname Eng}}', answers[9]);
  body.replaceText('{{Name Eng}}', answers[10]);

  if (answers[11] === '-') {
    body.replaceText('{{patronymic Eng}}', '');
  }
  else {
    body.replaceText('{{patronymic Eng}}', answers[11]);
  }

  body.replaceText('{{Date of Birth}}', answers[12]);

  if (answers[13] === 'получу лично') {
    body.findText('{{myself}}').getElement().setBold(true);
    body.replaceText('{{myself}}', 'получу лично');
    body.replaceText('{{somewhere}}', '');
    body.replaceText('{{somebody}}', '');
  }
  if (answers[13] === 'прошу направить почтовым отправлением с уведомлением о вручении по адресу') {
    body.findText('{{somewhere}}').getElement().setBold(true);
    body.replaceText('{{somewhere}}', answers[14]);
    body.replaceText('{{myself}}', 'получу лично');
    body.replaceText('{{somebody}}', '');
  }
  if (answers[13] === 'доверяю получить') {
    body.findText('{{somebody}}').getElement().setBold(true);
    body.replaceText('{{somebody}}', answers[15]);
    body.replaceText('{{myself}}', 'получу лично');
    body.replaceText('{{somewhere}}', '');
  }
  var range = e.range;
  const time = Utilities.formatDate(sheet.getRange(range.getLastRow(), 1).getValue(), 'GMT+3', 'dd.MM.yyyy');

  body.replaceText('{{today}}', time);  
  //We make our changes permanent by saving and closing the document
  doc.saveAndClose();


  MailApp.sendEmail(answers[16], 'title', 'msg', {name: 'from',attachments: [doc]})
  //Store the url of our new document in a variable

  const url = doc.getUrl();

  //Write that value back to the 'Document Link' column in the spreadsheet. 
  sheet.getRange(range.getLastRow(), 18).setValue(url)

}
