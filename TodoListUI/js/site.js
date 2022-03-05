const apiUrl = "https://localhost:5001/"; 
const ulToDoList = $("ul#toDoList");
const frmNew = $("form#frmNewToDo")
const txtName = $("input#txtName")

//Methods
function addToDoItem(item, prepend = false) {
    let li = $("<li/>").attr("data-id", item.id).addClass(item.isDone ? "done" : "undone");
    li[0].toDoItem = item;
    let input = $("<input/>").attr("type","checkbox").prop("checked", item.isDone).change(statusChanged);
    let span = $("<span/>").text(item.name);
    let button = $("<button/>").addClass("btn tbn-danger btn-sm").text("Delete").click(deleteClicked);
    
    li.append(input).append(span).append(button);
    if(prepend) ulToDoList.prepend(li);
    else ulToDoList.append(li);
};

function statusChanged(event){
    const isChecked = $(this).prop("checked");
    const li = $(this).closest("li");
    li.removeClass("done", "undone").addClass(isChecked ? "done" : "undone");
    const toDoItem = li[0].toDoItem;
    toDoItem.isDone = isChecked;

    if (isChecked) ulToDoList.append(li);
    else ulToDoList.prepend(li);

    $.ajax({
        type:"PUT",
        url: apiUrl + "api/ToDoItems/" + toDoItem.id,
        data: JSON.stringify(toDoItem),
        contentType: "application/json",
        success: function(data){

        } 
    });
}    

function deleteClicked(event){
    const li = $(this).closest("li");
    const id = li.data("id");

    $.ajax({
        type:"DELETE",
        url: apiUrl + "api/ToDoItems/" + id,
        success: function(data){
            li.remove();
        } 
    });
};

function getToDoItems() {
    ulToDoList.html("");
    $.ajax({
        type:"GET",
        url: apiUrl + "api/ToDoItems",
        success: function(data){
            sortToDoItems(data);
            for (const item of data) {
                addToDoItem(item)
            };
        } 
    });
}

function sortToDoItems(items){
    items.sort((a,b) => a.isDone - b.isDone);
}

//Events
frmNew.submit(function(event){
    event.preventDefault();
    const newToDo = {name:txtName.val()};

    $.ajax({
        type:"POST",
        contentType:"application/json",
        url: apiUrl + "api/ToDoItems",
        data: JSON.stringify(newToDo),
        success: function(data){
            addToDoItem(data,true);
            txtName.val("");
        } 
    });
});


//Initialization
getToDoItems();

