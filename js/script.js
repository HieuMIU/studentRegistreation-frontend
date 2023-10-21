window.onload = display;

async function display() {
    let response = await fetch("http://localhost:5000/students");
    let json;
    if (response.ok) {
        json = await response.json();

        //add empty item for select tag
        addItemToDDLStudent("");
        addItemToDDLStudentForUpdate("");
        for (let e of json) {
            updateDisplayAfterAdd(e.id, e.name, e.program);
        }
    }
    else alert("Error" + response.status);
}

function addRowToTable(id, name, program) {
    let row = document.createElement('tr');
    row.setAttribute("id", id);
    for (let e of arguments) {
        let cell = document.createElement('td');
        cell.appendChild(document.createTextNode(e));
        row.appendChild(cell);
    }
    document.getElementById('tbodyStudentList').appendChild(row);
}

async function addStudent(id, name, program) {
    let obj = { id, name, program };
    let setting = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-Type": 'application/json' }
    }
    let response = await fetch("http://localhost:5000/students", setting);
    if (response.ok) {
        updateDisplayAfterAdd(id, name, program);
    } else alert("Error " + response.status);
}

document.getElementById('btnRegister').addEventListener("click", () => {
    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let program = document.getElementById('program').value;
    addStudent(id, name, program);
    document.getElementById('myform').reset()
});

function addItemToDDLStudent(id){
    
    newOption = document.createElement('option');
    newOption.setAttribute('id',`d-${id}`);
    newOption.setAttribute('value',id);
    newOption.textContent = id;
    document.getElementById('ddlStudent').appendChild(newOption);
}

function addItemToDDLStudentForUpdate(id){
    
    newOption = document.createElement('option');
    newOption.setAttribute('id',`u-${id}`);
    newOption.setAttribute('value',id);
    newOption.textContent = id;
    document.getElementById('ddlStudentForUpdate').appendChild(newOption);
}

function updateDisplayAfterAdd(id, name, program){
    addRowToTable(id, name, program);
    addItemToDDLStudent(id);
    addItemToDDLStudentForUpdate(id);
}

function updateDisplayAfterDelete(id){
    deleteRowInTable(id);
    deleteItemInDLLStudent(id);
    deleteItemInDLLStudentForUpdate(id);
}

function deleteRowInTable(id) {
    let table = document.getElementById('tbodyStudentList');
    var row = document.getElementById(id);
    table.removeChild(row);
}
function deleteItemInDLLStudent(id) {
    let select = document.getElementById('ddlStudent');
    var option = document.getElementById(`d-${id}`);
    select.removeChild(option);
}

function deleteItemInDLLStudentForUpdate(id) {
    let select = document.getElementById('ddlStudentForUpdate');
    var option = document.getElementById(`u-${id}`);
    select.removeChild(option);
}

async function deleteStudent(id){
    let setting = {
        method: "DELETE"
    }

    let response = await fetch(`http://localhost:5000/students/${id}`, setting);
    if(response.ok){
        alert(`Delete student id ${id} success`);
        updateDisplayAfterDelete(id);
    }else alert("Error " + response.status);
}

document.getElementById('btnDelete').addEventListener("click", () => {
    let id = document.getElementById('ddlStudent').value;
    if(id)
        deleteStudent(id);
    document.getElementById('ddlStudent').value = "";
})

document.getElementById('ddlStudentForUpdate').addEventListener("change", async function(){
    let id = document.getElementById('ddlStudentForUpdate').value;
    if(!id){
        document.getElementById('myform').reset();
        return;
    }
    let response = await fetch(`http://localhost:5000/students/${id}`);
    if(response.ok){
        let student = await response.json();
        document.getElementById('idForUpdate').value = student.id;
        document.getElementById('nameForUpdate').value = student.name;
        document.getElementById('programForUpdate').value = student.program;
    }
    else {
        document.getElementById('myform').reset();
    }
});

document.getElementById('btnUpdate').addEventListener("click", () => {
    let refId = document.getElementById('ddlStudentForUpdate').value;
    if(!refId)
        return;

    var id = document.getElementById('idForUpdate').value;
    var name = document.getElementById('nameForUpdate').value;
    var program = document.getElementById('programForUpdate').value;

    updateStudent(refId, id, name, program);
    document.getElementById('myform').reset()
})

async function updateStudent(refId, id, name, program) {
    let obj = { id, name, program };
    let setting = {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: { "Content-Type": 'application/json' }
    }
    let response = await fetch(`http://localhost:5000/students/${refId}`, setting);
    if (response.ok) {
        updateDisplayAfterUpdate(refId, id, name, program);
    } else alert("Error " + response.status);
}

function updateDisplayAfterUpdate(refId, id, name, program){
    updateRowInTable(refId, id, name, program);
    updateItemInDLLStudent(refId, id);
    updateItemInDLLStudentForUpdate(refId, id);
}

function updateRowInTable(refId, id, name, program) {
    let table = document.getElementById('tbodyStudentList');
    var row = document.getElementById(refId);
    row.innerHTML = "";

    row.setAttribute("id", id);

    let argsArray = Array.from(arguments).slice(1);

    for (let e of argsArray) {
        let cell = document.createElement('td');
        cell.appendChild(document.createTextNode(e));
        row.appendChild(cell);
    }
}
function updateItemInDLLStudent(refId, id) {
    let select = document.getElementById('ddlStudent');
    var option = document.getElementById(`d-${refId}`);
    option.textContent = id;
    option.setAttribute('id',`d-${id}`);
    option.setAttribute('value',id);

}

function updateItemInDLLStudentForUpdate(refId, id) {
    let select = document.getElementById('ddlStudentForUpdate');
    var option = document.getElementById(`u-${refId}`);
    option.textContent = id;
    option.setAttribute('id',`u-${id}`);
    option.setAttribute('value',id);
}