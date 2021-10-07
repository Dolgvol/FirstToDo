"use strict"

let nextId = 1;

function makeItem(payload) {
   return {
      id: nextId++,
      active: payload.active,
      category: payload.category,
      created: payload.created || getCurrentDate(),
      name: payload.name,
      content: payload.content,
      dates: getDatesFromText(payload?.content),
   };
 }

 function getCurrentDate() {
   let todayDate = new Date();
   let monthDate = todayDate.getMonth();
   let dayDate = todayDate.getDate();
   let yearDate = todayDate.getFullYear();

   let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
   let curMonth = months[monthDate];

   let dateInFormat = curMonth + ' ' + dayDate + ', ' + yearDate;
   return dateInFormat;
}

function getDatesFromText(text) {
   let datesInText = text.match(/\d{1,2}([_|.\-/ ])\d{1,2}([_|.\-/ ])\d{2,4}/gu);  
   if (datesInText) {
      let datesString = datesInText.join(', ');
      return datesString;
   } else {
      return '';
   }
}

export {
   makeItem,
}