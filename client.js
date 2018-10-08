console.log('js');
$(ready);

let employees = [];

class Employee {
	constructor(firstname, lastname, title, id, salary) {
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
}

function submitForm(e) {
	e.preventDefault()
	// console.log('in submitForm');
	let ar = $(this).serializeArray();
	console.log('serialized', ar);

	ar = employeeArray(ar);
	console.log('employeeArray', ar);
	
	ar = addToList(ar);
	console.log('addToList', ar);
	
	updateDOM();
}

const employeeArray = array => {
	console.log('in employeeArray');
	let newEmployee = new Employee()
	array.forEach(value => {
		Object.defineProperty(newEmployee, value.name, {
			value: value.value
		});
	})
	newEmployee.employeeid = cleanId(newEmployee.employeeid)
	newEmployee.salary = parseFloat(newEmployee.salary).toFixed(2);
	return newEmployee;
}

const cleanId = id => {
	// remove whitespace
	let cleanId = id.replace(/\s/g, '');
	// remove non-alphanumeric from beginning and end
	cleanId = cleanId.replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '');
	return cleanId;
}

const checkId = id => {
	const match = employees.find(employee => employee.employeeid === id);
	console.log(match);
	if (match === undefined) {
		return true;
	} else {
		// TODO: allow user to update existing employee.
		alert('Employee with this id already exists.')
		return false;
	}
}

const checkSalary = employee => {
	console.log(employee.salary);
	
	if (isNaN(Number(employee.salary)) || Number(employee.salary) < 0) {
		alert('Salary must be a non-negative number.');
		return false;
	} else {
		return true;
	}
}

const addToList = employee => {
	if (checkSalary(employee) && checkId(employee.employeeid)) {
		employees.push(employee)
	}
	return employees;
}

const updateDOM = () => {
	console.log('in updateDOM');
	console.log('employees', employees);
	$("tbody").empty()	
	for (let i of employees) {
		$("tbody").append("<tr></tr>");
		$("tr:last").append(`<td>${i.employeeid}</td>`)
		.append(`<td>${i.firstname}</td>`)
		.append(`<td>${i.lastname}</td>`)
		.append(`<td>${i.jobtitle}</td>`)
		.append(`<td class="has-text-right">${i.salary}</td>`)
		.append(`<td><button class="button is-danger">Delete</td>`)

		$("button:last")
		.attr("id", i.employeeid)
		.on("click", removeRow);
	}
	updateTotal();
	$("form input").val('');
	$("#employeeid").focus();
	return;
}

const updateTotal = () => {
	const total = employees.reduce((a, b) => {
		return a + Number(b.salary)
	}, 0);
	console.log('total', total);
	$("#monthlytotal").html((total/12).toFixed(2));
}

const removeRow = e => {
	console.log(e.target.id);
	// TODO: alert to confirm deletion.
	const index = employees.findIndex(employee => employee.employeeid === e.target.id)
	console.log(index);
	employees.splice(index, 1);
	return updateDOM();	
}

const ensureNum = entity =>
  typeof entity === 'string' ? parseInt(entity) : entity

const addNums = (a, b) => a + b

const incrementEach = (ar, by) =>
  ar.map(ensureNum)
		.map(num => addNums(num, by))
		
		console.log(incrementEach([1, 2, 3,], 2));

// The application should have an input form that collects _employee first name, last name, ID number, job title, annual salary_.

// A 'Submit' button should collect the form information, store the information to calculate monthly costs, append information to the DOM and clear the input fields. Using the stored information, calculate monthly costs and append this to the to DOM. If the total monthly cost exceeds $20,000, add a red background color to the total monthly cost.

// Create a delete button that removes an employee from the DOM. For Base mode, it does **not** need to remove that Employee's salary from the reported total.