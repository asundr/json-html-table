"use strict"

var params = [];
var arr = [];
var table = document.getElementsByTagName("tbody")[0];
var headers = table.children[0];
var obj_submit = document.getElementById("object_submit");
var output = document.getElementById("output");
var addColCell = document.getElementById("addcol");
var addRowButton = document.getElementById("addrow");
var headerOffset = table.parentElement.offsetTop;

//document.body.addEventListener("scroll", () => temp(), false);
function temp() {
	if (document.body.scrollTop > headerOffset){
		headers.classList.add("sticky");
		table.style.paddingTop = "13px";
	} else {
		headers.classList.remove("sticky");
	}
};

function addSubmission(name){
	var elem = document.createElement("input");
	elem.appendChild(document.createTextNode(name));
	elem.type = "text";
	obj_submit.appendChild(elem);
}

function addRow(){
	var row = document.createElement("tr");
	row.contenteditable = "false";
	//row.contenteditable = "true";
	for (let i=0; i<headers.children.length-1; i++) {
		var cell = document.createElement("td");
		cell.appendChild(document.createTextNode(""));
		cell.contenteditable = "true";
		row.appendChild(cell);
	}
	table.appendChild(row);
	return row;
}

function removeCol(){
	
}

function promptCol() {
	var name = prompt("Enter a unique parameter name");
	if (name === "" || name === null)
		return;
	addCol(name);
}

function addCol(name){
	
	addColCell.id = "addcol-sm";
	addRowButton.id = "addrow-vis";
	
	for (let i=0; i<headers.children.length-1; i++) {
		if (headers.children[i].innerHTML === name){
			alert("'" + name + "' is already a parameter");
			return;
		}
	}
	
	var elem = document.createElement("th");
	elem.appendChild(document.createTextNode(name));
	headers.insertBefore(elem, headers.children[headers.children.length-1]);
	
	for (let i=1; i<table.children.length; i++){
		var cell = document.createElement("td");
		cell.contenteditable="true";
		cell.appendChild(document.createTextNode(""));
		table.children[i].appendChild(cell);
	}
}

function updateJSON(){
	if (table.children.length < 2)
		return output.innerHTML = "[]";
	var names=headers.children;
	var len = names.length-1;
	var json = "[ " + rowToJSON(table.children[1]);
	for (let row = 2; row < table.children.length; row++){
		json += ", " + rowToJSON(table.children[row]);
	}
	output.style.display = "block";
	output.value = json + " ]";
}

function rowToJSON(row){
	if (row.children.length < 1)
		return "{}";
	var json = "{ " + getKeyValue(row, 0);
	for (let i=1; i<row.children.length; i++) {
		json += ", " + getKeyValue(row, i);
	}
	return json + " }";
}

function getKeyValue(row, i){
	var out =  "\"" + headers.children[i].innerHTML + "\": \"";
	if (row.children[i].innerHTML !== "<br>")
		out += row.children[i].innerHTML;
	return out  + "\"";
}

function JSONToTable() {
	try {
		var out = JSON.parse(document.getElementById("json-in").value);
	} catch (e) {
		console.error("JSON input could not be parsed");
		return;
	}
	clearTable();
	for (let x in out[0]) {
		addCol(x);
	}
	for (let i in out){
		let obj = out[i];
		let row = addRow();
		let col = 0;
		for (let v in obj) {
			row.children[col++].innerHTML = obj[v];
		}
	}
}

function clearTable() {
	for (let i=headers.children.length-2; i>=0; i--){
		headers.removeChild(headers.children[i]);
	}
	for(let i=table.children.length-1; i>=1; i--){
		table.removeChild(table.children[i]);
	}
}