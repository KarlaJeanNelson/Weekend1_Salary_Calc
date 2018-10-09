"use strict";

console.log('js');
$(ready);
// $(document).ready( function () {
// 	$('#myTable').DataTable();
// } );

let employees = [];
const threshhold = 20000;

class Employee {
	functionructor(firstname, lastname, title, id, salary) {
		this.employeeid = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.jobtitle = title;
		this.salary = salary;
	}
}

function ready() {
	console.log('jq');
	$("form").on("submit", submitForm);
	$("table").on("click", "button", editOrDel)
}

function submitForm(e) {
	e.preventDefault()
	// console.log('in submitForm', $(this));
	let ar = $(this).serializeArray();
	// console.log('ar', ar);
	let newPerson = createEmployee(ar);
	// console.log(newPerson);
	addToList(newPerson);
	updateDOM();
	resetForm();
}

function resetForm() {
	$("form input").val('');
	$("#employeeid").focus();
	return;
}

function createEmployee(array) {	
	console.log('in employeeArray', array);
	let newEmployee = new Employee()
	console.log('newEmployee', newEmployee);
	array.forEach(function(value) {
		console.log(value);
		newEmployee[value.name] = value.value		
	})
	console.log(newEmployee.employeeid);
	newEmployee.employeeid = cleanId(newEmployee.employeeid)
	newEmployee.salary = parseFloat(newEmployee.salary).toFixed(2);
	return newEmployee;
}

function cleanId(id) {
	// remove whitespace
	let cleanId = id.replace(/\s/g, '');
	// remove non-alphanumeric from beginning and end
	cleanId = cleanId.replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
	return cleanId;
}

function checkId(id) {
	let match = findId(id).employeeObj;
	console.log('in checkId, match', match);
	if (match !== undefined) {
		alert('Employee with this id already exists.');
	}
	return match === undefined;
}

function findId(id) {
	return {
		employeeObj: employees.find(employee => employee.employeeid === id),
		index: employees.findIndex(employee => employee.employeeid === id)
	}
}

function checkSalary(employee) {
	console.log(employee.salary);
	if (isNaN(Number(employee.salary)) || Number(employee.salary) < 0) {
		alert('Salary must be a non-negative number.');
	}
	// console.log(!isNaN(Number(employee.salary)) && Number(employee.salary) > 0);
	return !isNaN(Number(employee.salary)) && Number(employee.salary) >= 0
}

function addToList(employee) {
	if (checkSalary(employee) && checkId(employee.employeeid)) {
		employees.push(employee);
	}
	return employees;
}

function updateDOM() {
	// console.log('in updateDOM');
	// console.log('employees', employees);
	// TODO(DONE): split out button addition
	$("tbody").empty()	
	for (let i of employees) {
		console.log(i);		
		$("tbody").append("<tr></tr>").data('employeeId', i.employeeid);
		$("tr:last").append(`<td>${i.employeeid}</td>`)
		.append(`<td>${i.firstname}</td>`)
		.append(`<td>${i.lastname}</td>`)
		.append(`<td>${i.jobtitle}</td>`)
		.append(`<td class="has-text-right">${i.salary}</td>`)
		.append(`<td class="has-text-right"><button class="button is-danger is-small">Delete</td>`)
		addButtons(i);
	}
	toggleClass(updateTotal(), $("tfoot"), "red");
	return;
}

function addButtons(emp) {
	$("button:last").data('employeeId', emp.employeeid)

	$("td:last").append(`<button class="button is-link is-small">Edit</td>`);
	$("button:last").data('employeeId', emp.employeeid)
}

function updateTotal() {
	const total = employees.reduce((a, b) => {
		return a + Number(b.salary)
	}, 0);
	console.log('total', total);
	$("#monthlytotal").html((total/12).toFixed(2));
	return parseFloat($("#monthlytotal").html()) > threshhold;
}

function toggleClass(bool, element, className) {
	bool ? element.addClass(className) : element.removeClass(className);
	return;
}

function editOrDel(e) {
	console.log('in editOrDel');
	console.log($(this).html());
	if ($(this).html() === 'Delete') {
		removeRow($(this).data());
	} else {
		editRow($(this).data());
	}
	return;
}

function removeRow(data) {
	console.log('in removeRow', data.employeeId);
	
	// TODO: alert to confirm deletion.
	let index = findId(data.employeeId).index;
	console.log(index);
	employees.splice(index, 1);
	updateDOM();
	return;	
}

function editRow(id) {
	// do stuff
	$('table').find(`[html=${id.employeeid}]`).addClass("red");
}

// function editRow1(e) {
// 	let id = e.target.id;
// 	id = id.substring(0, id.length - 5);
// 	// console.log('in editRow', id);
// 	let match = findId(id).employeeObj;
// 	console.log(match);
	
// 	let formInputs = $("form input")
// 	for (let input of formInputs) {
// 		console.log('input.id', input.id);
// 		$("form").find(`#${input.id}`).val()
// 		// input.attr("value", "hi")
// 	}
// }

// function editRow(e) {
// 	let myTable = $("#myTable");
// $('#myTable').on( 'click', 'tbody tr', function () {
// 	myTable.row( this ).edit();
// } );
// }



// The application should have an input form that collects _employee first name, last name, ID number, job title, annual salary_.

// A 'Submit' button should collect the form information, store the information to calculate monthly costs, append information to the DOM and clear the input fields. Using the stored information, calculate monthly costs and append this to the to DOM. If the total monthly cost exceeds $20,000, add a red background color to the total monthly cost.

// Create a delete button that removes an employee from the DOM. For Base mode, it does **not** need to remove that Employee's salary from the reported total.