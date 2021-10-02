
function makeItem(payload) {
   return {
      active: payload.active,
      category: payload.category,
      created: getCurrentDate(),
      name: payload.name,
      content: payload.content,
      dates: getDatesFromText(payload?.content || ''),
   };
 }; 

 function getCurrentDate() {
   let todayDate = new Date();
   let monthDate = todayDate.getMonth();
   let dayDate = todayDate.getDate();
   let yearDate = todayDate.getFullYear();

   let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
   let curMonth = months[monthDate];

   let dateInFormat = curMonth + ' ' + dayDate + ', ' + yearDate;
   return dateInFormat;
};

function getDatesFromText(text) {
   let datesInText = text.match(/\d{1,2}([.\-/ ])\d{1,2}([.\-/ ])\d{4}/gu);   
   return datesInText.join(', ');
};

export default {
   makeItem
};