const apiUrl = 'http://localhost:3000/attendance'; // Your API URL
let jsonData = {
    "attendance": [] // Start with an empty attendance list
};

// Fetch initial data from the server
function fetchAttendance() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            jsonData.attendance = data;
            updateStudentList();
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Create or update student record
function addOrUpdateStudent(name, mentor, date) {
    const existingStudent = jsonData.attendance.find(student => student.studentName === name && student.date === date);

    if (existingStudent) {
        // Update existing record
        fetch(`${apiUrl}/${existingStudent.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ technicalMentor: mentor })
        })
        .then(response => response.json())
        .then(data => {
            alert(`${name}'s record has been updated.`);
            fetchAttendance(); // Refresh the attendance list
        })
        .catch(error => console.error('Error updating record:', error));
    } else {
        // Create new record
        const newStudent = {
            id: Date.now(), // Use a proper unique ID generator for production
            studentName: name,
            technicalMentor: mentor,
            date: date,
            present: false // Default to false on addition
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStudent)
        })
        .then(response => response.json())
        .then(data => {
            alert(`${name} has been added to the attendance list.`);
            fetchAttendance(); // Refresh the attendance list
        })
        .catch(error => console.error('Error adding record:', error));
    }
}

// Update the displayed student list
function updateStudentList() {
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = ''; // Clear the list

    jsonData.attendance.forEach(student => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = student.studentName;
        row.appendChild(nameCell);

        const mentorCell = document.createElement('td');
        mentorCell.textContent = student.technicalMentor;
        row.appendChild(mentorCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = student.date;
        row.appendChild(dateCell);

        const presentCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = student.present;
        checkbox.onchange = function() {
            student.present = this.checked;
            // Update presence status in the server
            fetch(`${apiUrl}/${student.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ present: student.present })
            });
        };
        presentCell.appendChild(checkbox);
        row.appendChild(presentCell);

        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            fetch(`${apiUrl}/${student.id}`, {
                method: 'DELETE'
            })
            .then(() => {
                alert(`${student.studentName} has been deleted.`);
                fetchAttendance(); // Refresh the list after deletion
            })
            .catch(error => console.error('Error deleting record:', error));
        };
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        studentList.appendChild(row);
    });
}

// Fetch initial data on page load
fetchAttendance();

// Handle form submission
document.getElementById('attendance-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const studentName = document.getElementById('student-name').value;
    const mentor = document.getElementById('technical-mentor').value;
    const date = document.getElementById('date').value;

    addOrUpdateStudent(studentName, mentor, date);

    // Clear input fields
    document.getElementById('student-name').value = '';
    document.getElementById('technical-mentor').value = '';
    document.getElementById('date').value = '';
});
