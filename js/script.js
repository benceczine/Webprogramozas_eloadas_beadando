var selectedIndex = null;
var array1 = new Array();
array1.push({"date":"1994.05.15","nev":"Monaco","country":"Monaco"});
array1.push({"date":"1979.07.14","nev":"Brit","country":"Nagy-Britannia"});
array1.push({"date":"1976.07.18","nev":"Brit","country":"Nagy-Britannia"});
array1.push({"date":"1994.07.31","nev":"Német","country":"Németország"});
array1.push({"date":"1978.09.10","nev":"Olasz","country":"Olaszország"});
printArray();
function printArray(){
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    table.innerHTML="";
    var newRow;
    for (i = 0; i < array1.length; i++) {
        newRow = table.insertRow(table.length);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = array1[i].date;
        cell2 = newRow.insertCell(1);
        cell2.innerHTML = array1[i].nev;
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = array1[i].country;
        cell4 = newRow.insertCell(3);
        cell4.innerHTML = '<a onClick="onEdit('+i+')">Edit</a>' + '<a onClick="onDelete('+i+')">Delete</a>';
    }
}
function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectedIndex==null)
            insertNewRecord(formData);
        else
            updateRecord(formData);
        resetForm();
    }
}
function readFormData() {
    var formData = {};
    formData["date"] = document.getElementById("date").value;
    formData["nev"] = document.getElementById("nev").value;
    formData["country"] = document.getElementById("country").value;
    return formData;
}

function insertNewRecord(data) {
    array1.push({"date":data.date,"nev":data.nev,"country":data.country});
    printArray();
}

function resetForm() {
    document.getElementById("date").value = "";
    document.getElementById("nev").value = "";
    document.getElementById("country").value = "";
    selectedIndex=null;
}
function onEdit(index) {
    document.getElementById("date").value = array1[index].date;
    document.getElementById("nev").value = array1[index].nev;
    document.getElementById("country").value = array1[index].country;
    selectedIndex=index;
}
function updateRecord(formData) {
    array1[selectedIndex].date=formData.date;
    array1[selectedIndex].nev=formData.nev;
    array1[selectedIndex].country=formData.country;
    printArray();
}
function onDelete(index) {
    if (confirm('Are you sure to delete this record ?')) {
        array1.splice(index, 1); // Deleting the entry with the specified index
        resetForm();
        printArray();
    }
}
function validate() {
    isValid = true;
    if (document.getElementById("date").value == "") {
        isValid = false;
        document.getElementById("dateValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("dateValidationError").classList.contains("hide"))
            document.getElementById("dateValidationError").classList.add("hide");
    }
    return isValid;
}