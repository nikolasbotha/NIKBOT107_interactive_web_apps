import{html, createOrderHtml, updateDraggingHtml, moveToColumn  } from '../scripts/view.js'
import{createOrderData, updateDragging, state } from '../scripts/data.js'
// import{ } from '../scripts/data.js'

//console.log(createOrderData())
/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */



const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath();
    let column = null;

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
        
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
    
};

let draggedItem
let id 

const handleDragStart = (event) => {
    //event.preventDefault();
    draggedItem = event.target.closest(".order");
    state.dragging.source = state.dragging.over;
    id = draggedItem.dataset.id;
    
}

const handleDragEnd = (event) => {
    event.preventDefault();
    const moveTo = state.dragging.over;
    moveToColumn(id, moveTo);
    updateDraggingHtml({over: null});
 
}



const handleHelpToggle = (event) => {
    if (html.help.overlay.hasAttribute('open')){
        html.help.overlay.removeAttribute('open')
    }
    else {
        html.help.overlay.setAttribute('open', true)
    }
}


const handleAddToggle = (event) => {

    if (html.add.overlay.hasAttribute('open')){
        html.add.overlay.removeAttribute('open')
    }
    else {
     html.add.overlay.setAttribute('open', true)
    }}

const handleAddSubmit = (event) => {

    event.preventDefault();
    const props = {
        title : html.add.title.value,
        table : html.add.table.value,
        column : 'ordered'
    }
    const orderContent = createOrderData(props)
    const htmlOrderContent = createOrderHtml(orderContent)
    const orderedArea = document.querySelector('[data-area="ordered"]')
    const orderDiv = orderedArea.querySelector('[data-column="ordered"]')
    orderDiv.appendChild(htmlOrderContent)
    handleAddToggle();
}

let element = ""
const handleEditToggle = (event) => {

    event.preventDefault();

    element = event.target.closest( ".order" )

    if ( html.edit.overlay.hasAttribute('open')){
        html.edit.overlay.removeAttribute('open')
    } else {
        if (element != null ) {
            html.edit.overlay.setAttribute('open', true)   
            const title = element.querySelector('[data-order-title]').innerText;
            const table = element.querySelector('[data-order-table]').innerText;
            const editElement = document.querySelector('[data-edit-overlay]');
            const form = editElement.querySelector('[data-edit-form]');
            form.querySelector('[data-edit-title]').value = title 
            form.querySelector('[data-edit-table]').value =  table
            
    }} 
}


const handleEditSubmit = (event) => {
    event.preventDefault()
    element.remove()
    const props = {
        title : html.edit.title.value,
        table : html.edit.table.value,
        column : html.edit.column.value,
    };
    const orderContent = createOrderData(props)
    const htmlOrderContent = createOrderHtml(orderContent)
    const orderedArea = document.querySelector(`[data-area="${props.column}"]`);
    const orderDiv = orderedArea.querySelector(`[data-column="${props.column}"]`)
    orderDiv.appendChild(htmlOrderContent)
    html.edit.overlay.removeAttribute('open')

}
const handleDelete = (event) => {
    event.preventDefault();
    element.remove()
    html.edit.overlay.removeAttribute('open')
}




html.add.cancel.addEventListener('click', handleAddToggle)   // function 4
html.other.add.addEventListener('click', handleAddToggle)    // function 4
html.add.form.addEventListener('submit', handleAddSubmit)    //  function 5
html.other.grid.addEventListener('click', handleEditToggle)    //  function 6
html.edit.cancel.addEventListener('click', handleEditToggle)    // fucntion 6
html.edit.form.addEventListener('submit', handleEditSubmit)     //  function 7
html.edit.delete.addEventListener('click', handleDelete)    //    fucntion 7
html.help.cancel.addEventListener('click', handleHelpToggle)       // function 3
html.other.help.addEventListener('click', handleHelpToggle)     //    function 4

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)   //   function 1
    htmlColumn.addEventListener('dragend', handleDragEnd)       // fucntion 2
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)    //  ??? probably 2
}

