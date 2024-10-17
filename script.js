
document.getElementById('attendance-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const studentName = document.getElementById('student-name').value;
    addStudentToList(studentName);
    document.getElementById('student-name').value = ''; 
});

function addStudentToList(name) {
    const studentList = document.getElementById('student-list');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = name;
    row.appendChild(nameCell);

    const presentCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    presentCell.appendChild(checkbox);
    row.appendChild(presentCell);

    const actionsCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = function() {
        studentList.removeChild(row);
    };
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    studentList.appendChild(row);
}



