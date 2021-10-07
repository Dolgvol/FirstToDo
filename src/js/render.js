"use strict"
import Storage from './storage';


const mainTable = document.querySelector('#table-main1');
const filterBlock = document.querySelector('#filter1');
const formMain = document.forms[0]

const viewModal = document.querySelector('.wrapper-view');
const createEditModal = document.querySelector('.wrapper-edit');
const closeModalButtons = document.querySelectorAll('.close-btn-modal');

// let eventCreate = new Event("click", {bubbles: false, cancelable: false, composed: false});
// mainTable.addEventListener("click", (event) => {
//    console.log('sdad');   
// })
// mainTable.dispatchEvent(eventCreate);

let stateOfList = 'active';
if (filterBlock) {
   filterBlock.addEventListener("change", (event) => {
      
      if (filterBlock.value === 'active') {

         stateOfList = 'active';
         renderTable();
      }
      if (filterBlock.value === 'archived') {

         stateOfList = 'archived';
         renderTable();
      }
      if (filterBlock.value === 'all') {
         stateOfList = 'all';
         renderTable();
      }
   });
}

if (mainTable) {
      mainTable.addEventListener("click", (event) => {
         let actionEl = event.target.closest('[data-action]');
         // console.log(actionEl);

         if (actionEl && actionEl.dataset.action === 'open') {
            viewModal.style.display = 'block'; 
            const currentItem = Storage.getItem(actionEl.dataset.id);
            renderViewModal(currentItem);
          }
         
         if (actionEl && actionEl.dataset.action === 'edit') {
            createEditModal.style.display = 'block';
            const currentItem = Storage.getItem(actionEl.dataset.id);
            renderEditModal(currentItem);
          }

         if (actionEl && actionEl.dataset.action === 'create') {
            createEditModal.style.display = 'block';         
            renderCreateModal();
         }
          
         if (actionEl && actionEl.dataset.action === 'delete') {
            if (Storage.deleteItem(actionEl.dataset.id)) {
               renderTable();
               renderCategoryCounter();
            }
         }

         if (actionEl && actionEl.dataset.action === 'archive') {
            if (Storage.editItem(actionEl.dataset.id, {active: false})) {
               renderTable();
               renderCategoryCounter();
            }
         }

         if (actionEl && actionEl.dataset.action === 'activate') {
            if (Storage.editItem(actionEl.dataset.id, {active: true})) {
               renderTable();
               renderCategoryCounter();
            }
         }

         if (actionEl && actionEl.dataset.action === 'archive-all') {
            if (Storage.archiveAllItems()) {
               renderTable();
               renderCategoryCounter();
            }
         }

         if (actionEl && actionEl.dataset.action === 'delete-all') {
            if (Storage.deleteAllItems()) {
               renderTable();
               renderCategoryCounter();
            }
         }

      });
}

formMain.addEventListener("submit", (event) => {
   event.preventDefault();
   // console.log('submit');   
   const action = formMain.elements.action.value;
   const id = formMain.elements.id.value;

   if (action === 'edit') {
      Storage.editItem(id, createPayload(Storage.getItem(id).active));
      createEditModal.style.display = 'none'; 
      renderTable();    
   }
   if (action === 'create') {
      Storage.createItem(createPayload());
      createEditModal.style.display = 'none'; 
      renderTable();   
      renderCategoryCounter(); 
   }
});

if (closeModalButtons) {
   for (const closeModalBtn of closeModalButtons) {
      closeModalBtn.addEventListener("click", () => {
         closeModalBtn.parentElement.parentElement.parentElement.style.display = 'none';
      });
   }
}

if (viewModal) {
   viewModal.addEventListener("click", (event) => {
      let target = event.target;
      if (target.className === 'wrapper-view') {
         viewModal.style.display = 'none';
      }
   });
}

if (createEditModal) {
   createEditModal.addEventListener("click", (event) => {
      let target = event.target;
      if (target.className === 'wrapper-edit') {
         createEditModal.style.display = 'none';
      }
   });
}




renderTable()
function renderTable() {
   // console.log('render');   
   const table = document.getElementById('items1')
   const list = Storage.getList(stateOfList);
   table.innerHTML = '';
   let archiveSvg = '';
   let categorySvg = '';
   list.forEach((object) => {
      const newDiv = document.createElement("div");
      if (object.active) {
         archiveSvg = `<a class='archive-current managment-icon' data-id="${object.id}" data-action="archive">
         <svg width="25px" height="25px" fill="#777777" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" 
         class="fa-archive g-svg" role="img" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>
         </a>`;
      } else {
         archiveSvg = `<a class='activate-current managment-icon' data-id="${object.id}" data-action="activate">
         <svg width="25px" height="25px" fill="#777777" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="upload" 
         class="fa-activate g-svg" role="img" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>
         </a>`;
      }
      if (object.category === 'Task') {
         categorySvg = `<svg width="20px" height="20px" fill="#ffffff" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shopping-cart" 
         class="fa-shopping-cart w-svg" role="img" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path></svg>
         `;
      } 
      if (object.category === 'Random Thought') {
         categorySvg = `<svg width="20px" height="20px" fill="#ffffff" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="brain" 
         class="fa-brain w-svg" role="img" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M208 0c-29.9 0-54.7 20.5-61.8 48.2-.8 0-1.4-.2-2.2-.2-35.3 0-64 28.7-64 64 0 4.8.6 9.5 1.7 14C52.5 138 32 166.6 32 200c0 12.6 3.2 24.3 8.3 34.9C16.3 248.7 0 274.3 0 304c0 33.3 20.4 61.9 49.4 73.9-.9 4.6-1.4 9.3-1.4 14.1 0 39.8 32.2 72 72 72 4.1 0 8.1-.5 12-1.2 9.6 28.5 36.2 49.2 68 49.2 39.8 0 72-32.2 72-72V64c0-35.3-28.7-64-64-64zm368 304c0-29.7-16.3-55.3-40.3-69.1 5.2-10.6 8.3-22.3 8.3-34.9 0-33.4-20.5-62-49.7-74 1-4.5 1.7-9.2 1.7-14 0-35.3-28.7-64-64-64-.8 0-1.5.2-2.2.2C422.7 20.5 397.9 0 368 0c-35.3 0-64 28.6-64 64v376c0 39.8 32.2 72 72 72 31.8 0 58.4-20.7 68-49.2 3.9.7 7.9 1.2 12 1.2 39.8 0 72-32.2 72-72 0-4.8-.5-9.5-1.4-14.1 29-12 49.4-40.6 49.4-73.9z"></path></svg>
       `;
      } 
      if (object.category === 'Idea') {
         categorySvg = `<svg width="20px" height="20px" fill="#ffffff" aria-hidden="true" focusable="false" data-prefix="far" data-icon="lightbulb" 
         class="fa-lightbulb w-svg" role="img" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"></path></svg>
       `;
      } 
      if (object.category === '') {
         categorySvg = ``;
      } 
      newDiv.innerHTML = `
      <div class="item-icon item-cell">
        <div class="icon-wrapper">
        ${categorySvg}
        </div>
      </div>
      <div class="item-name item-cell">${object.name}</div>
      <div class="item-created item-cell">${object.created}</div>
      <div class="item-category item-cell">${object.category}</div>
      <div class="item-content item-cell">${object.content}</div>
      <div class="item-dates item-cell">${object.dates}</div>    
      <div class="item-managment">
         <a class="open-modal managment-icon" data-id="${object.id}" data-action="open">
         <svg width="25px" height="25px" fill="#777777" aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" 
         class="fa-eye g-svg" role="img" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg>
         </a>
         <a class='edit-current managment-icon' data-id="${object.id}" data-action="edit">
         <svg width="25px" height="25px" fill="#777777" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" 
         class="fa-pen g-svg" role="img" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>
         </a>
         ${archiveSvg}
         <a class='delete-current managment-icon' data-id="${object.id}" data-action="delete">
         <svg width="25px" height="25px" fill="#777777" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" 
         class="fa-trash g-svg" role="img" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
         <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>
         </a>
      </div>`;
      newDiv.classList.add('item-row');
      if (object.active) {
         newDiv.classList.add('active');
      } else {
         newDiv.classList.add('archived');
      }
      setTimeout(() => table.appendChild(newDiv));
   });
}



function renderViewModal(object) {
   const viewModal = document.getElementById('modal-view-block1');
   let categorySvg = '';
   if (object.category === 'Task') {
      categorySvg = `<svg width="20px" height="20px" fill="#ffffff" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shopping-cart" 
      class="fa-shopping-cart w-svg" role="img" 
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path></svg>
      `;
   } 
   if (object.category === 'Random Thought') {
      categorySvg = `<svg width="20px" height="20px" fill="#ffffff" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="brain" 
      class="fa-brain w-svg" role="img" 
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M208 0c-29.9 0-54.7 20.5-61.8 48.2-.8 0-1.4-.2-2.2-.2-35.3 0-64 28.7-64 64 0 4.8.6 9.5 1.7 14C52.5 138 32 166.6 32 200c0 12.6 3.2 24.3 8.3 34.9C16.3 248.7 0 274.3 0 304c0 33.3 20.4 61.9 49.4 73.9-.9 4.6-1.4 9.3-1.4 14.1 0 39.8 32.2 72 72 72 4.1 0 8.1-.5 12-1.2 9.6 28.5 36.2 49.2 68 49.2 39.8 0 72-32.2 72-72V64c0-35.3-28.7-64-64-64zm368 304c0-29.7-16.3-55.3-40.3-69.1 5.2-10.6 8.3-22.3 8.3-34.9 0-33.4-20.5-62-49.7-74 1-4.5 1.7-9.2 1.7-14 0-35.3-28.7-64-64-64-.8 0-1.5.2-2.2.2C422.7 20.5 397.9 0 368 0c-35.3 0-64 28.6-64 64v376c0 39.8 32.2 72 72 72 31.8 0 58.4-20.7 68-49.2 3.9.7 7.9 1.2 12 1.2 39.8 0 72-32.2 72-72 0-4.8-.5-9.5-1.4-14.1 29-12 49.4-40.6 49.4-73.9z"></path></svg>
    `;
   } 
   if (object.category === 'Idea') {
      categorySvg = `<svg width="20px" height="20px" fill="#ffffff" aria-hidden="true" focusable="false" data-prefix="far" data-icon="lightbulb" 
      class="fa-lightbulb w-svg" role="img" 
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"></path></svg>
    `;
   } 
   viewModal.innerHTML = ` 
   <div class="view-created">
   <div class="head-created">
     created:
   </div>
   <div class="text-created fill-view">
   ${object.created}
   </div>
   </div>
   <div class="view-title">
   <div class="icon-wrapper fill-view">
   ${categorySvg}
   </div>
   <div class="view-category fill-view">
   ${object.category}
   </div>
   </div>
   <div class="view-name fill-view">
   ${object.name}
   </div>
   <div class="view-content fill-view">
   ${object.content}
   </div>
   <div class="view-dates fill-view">
   ${object.dates}
   </div>`;
}


function renderEditModal(object) {
    formMain.elements.category.value = object.category;
    formMain.elements.name.value = object.name;
    formMain.elements.content.value = object.content;
    formMain.elements.action.value = 'edit';
    formMain.elements.id.value = object.id;
}

function renderCreateModal() {
   formMain.elements.category.value = null;
   formMain.elements.name.value = null;
   formMain.elements.content.value = null;
   formMain.elements.action.value = 'create';
   formMain.elements.id.value = null;
}


renderCategoryCounter();
function renderCategoryCounter() {
   const counterCells = document.querySelectorAll('.counter-cell');
   if (counterCells) {
      const archived = Storage.filterNotes('archived');
      const active = Storage.filterNotes('active');
      
      counterCells.forEach((element) => {      
         if (element.classList.contains('item-archived')) {
            if (archived.hasOwnProperty(element.dataset.counter)) {
               element.textContent = archived[element.dataset.counter].length;
            } else {
               element.textContent = 0;
            }
         } 
         if (element.classList.contains('item-active')) { 
            if (active.hasOwnProperty(element.dataset.counter)) {
               element.textContent = active[element.dataset.counter].length;
            } else {
               element.textContent = 0;
            }
         }
      });
   }
}




function createPayload(status = true) {
   return {
      active: status,
      category: formMain.elements.category.value,
      name: formMain.elements.name.value,
      content: formMain.elements.content.value,
   };
}
