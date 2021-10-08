"use strict"
import {makeItem} from './helpers';


const initialNotes = [
   {
      active: true,
      category: 'Task',
      created : 'April 20, 2021',
      name: 'Shopping list',
      content: 'Buy bread, cheese 5/5/2021',
   },
   {
      active: true,
      category: 'Task',
      created : 'April 21, 2021',
      name: 'Visit dentist',
      content: 'I have an appointment with the dentist for 14:00 at 25.04.2021',
   },
   {
      active: true,
      category: 'Random Thought',
      created : 'April 19, 2021',
      name: 'Bluetooth adapter',
      content: 'I can use bluetooth adapter on my pc',
   },
   {
      active: true,
      category: 'Idea',
      created : 'April 18, 2021',
      name: 'App problem',
      content: 'I can solve problem with my webapp by using this library',
   },

   {
      active: false,
      category: 'Task',
      created : 'April 1, 2021',
      name: 'Shopping list',
      content: 'Melon, orange, apple, mango 2-04-2021',
   },
   {
      active: false,
      category: 'Random Thought',
      created : 'April 5, 2021',
      name: 'Evolution of apes',
      content: 'Can I understand it by drawing an evolutionary tree?',
   },
   {
      active: false,
      category: 'Idea',
      created : 'April 3, 2021',
      name: 'New features',
      content: 'Implement new features from article in my project',
   },
];

const state = {
   itemsNotes: [],
}


state.itemsNotes = initialNotes.map((itemNote) => {
   return makeItem(itemNote);
});


function createItem(payload) {
   state.itemsNotes = [...state.itemsNotes, makeItem(payload)];
   return true;
}

function editItem(id, payload) {
   let res = false;
   state.itemsNotes = state.itemsNotes.map((itemNote) => {
      if (itemNote.id === Number(id)) {
         res = true;
         return makeItem({...itemNote, ...payload});
      }
      return itemNote;
   });
   return res;
}

function deleteItem(id) {
   const newNotes = [];
   let res = false;
   state.itemsNotes.forEach((itemNote) => {
      if (itemNote.id === Number(id)) {
         res = true;
      } else {
         newNotes.push(itemNote)
      }
   });
   state.itemsNotes = newNotes;
   return res;
}

function deleteAllItems(filter) {
   let res = false;
   if (filter === 'all') {
      res = true;
      state.itemsNotes = [];
   }
   if (filter === 'active') {
      res = true;
      state.itemsNotes = state.itemsNotes.filter(obj => obj.active === false);
   }
   if (filter === 'archived') {
      res = true;
      state.itemsNotes = state.itemsNotes.filter(obj => obj.active === true);
   }
   return res;
}

function archiveAllItems() {
   let res = false;
   state.itemsNotes = state.itemsNotes.map((itemNote) => {
      if (itemNote.active) {
         res = true;
         return {
            ...itemNote, 
            active: false,
         }
      }
      return itemNote
   });
   return res;
}

function getItem(id) {
    const currItem = state.itemsNotes.find((itemNote) => itemNote.id === Number(id));
    if (!currItem) {
      throw new Error('id не существует');
    } 
    return currItem;
}

function getList(filter) {
   if (filter === 'all') {
      return [...state.itemsNotes];
   }
   if (filter === 'active') {
      return state.itemsNotes.filter(obj => obj.active === true);
   }
   if (filter === 'archived') {
      return state.itemsNotes.filter(obj => obj.active === false);
   }
}

function filterNotes(filter) {
   const inputArray = getList(filter);
   const objOfArrays = {};

   inputArray.forEach((object) => {
      if (objOfArrays.hasOwnProperty(object.category)) {
         objOfArrays[object.category].push(object);
      } else {
         objOfArrays[object.category] = [object];
      }
   });
   // console.log(objOfArrays);   
   return objOfArrays;
}


export default {
   createItem, 
   editItem, 
   deleteItem, 
   deleteAllItems, 
   archiveAllItems,
   getList,
   getItem,
   filterNotes,
}