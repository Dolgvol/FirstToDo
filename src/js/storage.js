"use strict"
import {makeItem} from './helpers'

const itemsNotes = [
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




function createItem(payload) {
   itemsNotes.push(makeItem(payload));
   return true;
};

function editItem(index, payload) {
   if (index >= 0 && index < itemsNotes.length) {
      const old = itemsNotes[index];
      const updated = makeItem({...old, ...payload});
      itemsNotes.splice(index, 1, updated);
      return true;
   }
   return false;
};

function deleteItem(index) {
   if (index >= 0 && index < itemsNotes.length) {
      itemsNotes.splice(index, 1);
      return true;
   }
   return false;
};

function archiveItem(index) {
   if (index >= 0 && index < itemsNotes.length && itemsNotes[index].active) {
      itemsNotes[index].active = false;
      return true;
   }
   return false;
};

function activateItem(index) {
   if (index >= 0 && index < itemsNotes.length && !itemsNotes[index].active) {
      itemsNotes[index].active = true;
      return true;
   }
   return false;
};

function deleteAllItems() {
   itemsNotes.length = 0;
   return true;
};

function archiveAllItems() {
   return itemsNotes.reduce((isChanged, current) => {
      if (current.active) {
         current.active = false;
         isChanged = true;
      }
      return isChanged;
   }, false);
};

function getList(filter) {
   return [...itemsNotes];
};


export default {
   createItem, 
   editItem, 
   deleteItem, 
   archiveItem, 
   activateItem, 
   deleteAllItems, 
   archiveAllItems,
   getList
};