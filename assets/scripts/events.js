// let curElementNumber = 0;
// function scrollHandler() {
//   const distanceToBottom = document.body.getBoundingClientRect().bottom;

//     if (distanceToBottom < document.documentElement.clientHeight + 150) {
//       const newDataElement = document.createElement("div");
//       curElementNumber++;
//       newDataElement.innerHTML = `<p>Element ${curElementNumber}</p>`;
//       document.body.append(newDataElement);
//     }
// console.log(distanceToBottom < document.documentElement.clientHeight + 150)

// }

// window.addEventListener("scroll", scrollHandler);

// let currentElementNum = 0;

// function scrollHandler() {
//   if (
//     document.body.getBoundingClientRect().bottom <
//     document.documentElement.clientHeight + 150
//   ) {
//     const el = document.createElement("div");
//     currentElementNum++;
//     el.innerHTML = `<p>Element ${currentElementNum}</p>`;
//     document.body.append(el);
//   }
// }

// window.addEventListener("scroll", scrollHandler);

// const form = document.querySelector("form");

// form.addEventListener("submit", e => {
//   e.preventDefault();
//   console.log('sending')
// });

// const myDiv = document.querySelector('div');
// const btn = myDiv.querySelector('button');


// myDiv.addEventListener('click' , ()=> console.log('Div Clicked'))
// btn.addEventListener('click' , ()=> console.log('Btn Clicked'))


const listItems = document.querySelectorAll('li');

const list =document.querySelector('ul');



list.addEventListener('click' , (event)=>{
    event.target.closest('li').classList.toggle('highlight')
})
