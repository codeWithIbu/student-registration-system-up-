// script.js

document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentTableBody = document.querySelector('#studentTable tbody');
    const noRecordsMessage = document.getElementById('noRecordsMessage');

    let students = loadStudents(); // Load students from local storage

    // Function to load students from local storage
    function loadStudents() {
        const storedStudents = localStorage.getItem('students');
        return storedStudents ? JSON.parse(storedStudents) : [];
    }

    // Function to save students to local storage
    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Function to display students in the table
    function displayStudents() {
        studentTableBody.innerHTML = ''; // Clear existing rows
        if (students.length === 0) {
            noRecordsMessage.style.display = 'block'; // Show "no records" message
            studentTableBody.style.display = 'none'; // Hide table body
        } else {
            noRecordsMessage.style.display = 'none'; // Hide "no records" message
            studentTableBody.style.display = 'table-row-group'; // Show table body
            students.forEach((student, index) => {
                const row = studentTableBody.insertRow();
                row.dataset.index = index; // Store index for editing/deleting

                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.id}</td>
                    <td>${student.email}</td>
                    <td>${student.contact}</td>
                    <td class="action-buttons">
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </td>
                `;
            });
        }
    }

    // Function to validate input fields
    function validateInput(field, value) {
        switch (field) {
            case 'studentName':
                // Student name accepts only characters (and spaces, hyphens, apostrophes)
                return /^[a-zA-Z\s'-]+$/.test(value) && value.trim() !== '';
            case 'studentID':
                // Student ID accepts only numbers
                return /^[0-9]+$/.test(value) && value.trim() !== '';
            case 'emailID':
                // Basic email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.trim() !== '';
            case 'contactNo':
                // Contact number accepts only numbers
                return /^[0-9]+$/.test(value) && value.trim() !== '';
            default:
                return false;
        }
    }

    // Add new student record
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const studentName = document.getElementById('studentName').value.trim();
        const studentID = document.getElementById('studentID').value.trim();
        const emailID = document.getElementById('emailID').value.trim();
        const contactNo = document.getElementById('contactNo').value.trim();

        // Input validation
        if (!validateInput('studentName', studentName)) {
            alert('Please enter a valid student name (characters only).');
            return;
        }
        if (!validateInput('studentID', studentID)) {
            alert('Please enter a valid student ID (numbers only).');
            return;
        }
        if (!validateInput('emailID', emailID)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!validateInput('contactNo', contactNo)) {
            alert('Please enter a valid contact number (numbers only).');
            return;
        }

        // Check for duplicate student ID (optional but good practice)
        if (students.some(student => student.id === studentID)) {
            alert('A student with this ID already exists.');
            return;
        }

        const newStudent = {
            name: studentName,
            id: studentID,
            email: emailID,
            contact: contactNo
        };

        students.push(newStudent);
        saveStudents(); // Save to local storage
        displayStudents(); // Update table
        studentForm.reset(); // Clear form fields
    });

    // Edit and Delete functionality using event delegation
    studentTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const indexToEdit = parseInt(e.target.dataset.index);
            const studentToEdit = students[indexToEdit];

            // Populate the form with current student details for editing
            document.getElementById('studentName').value = studentToEdit.name;
            document.getElementById('studentID').value = studentToEdit.id;
            document.getElementById('emailID').value = studentToEdit.email;
            document.getElementById('contactNo').value = studentToEdit.contact;

            // Change button text and functionality
            document.getElementById('addStudentBtn').textContent = 'Update Student';
            document.getElementById('addStudentBtn').dataset.editingIndex = indexToEdit;
        } else if (e.target.classList.contains('delete-btn')) {
            const indexToDelete = parseInt(e.target.dataset.index);
            if (confirm('Are you sure you want to delete this student record?')) {
                students.splice(indexToDelete, 1); // Remove student from array
                saveStudents(); // Save to local storage
                displayStudents(); // Update table
            }
        }
    });

    // Handle update logic when 'Update Student' button is clicked
    studentForm.addEventListener('click', (e) => {
        if (e.target.id === 'addStudentBtn' && e.target.textContent === 'Update Student') {
            e.preventDefault(); // Prevent default form submission

            const indexToUpdate = parseInt(e.target.dataset.editingIndex);
            const studentName = document.getElementById('studentName').value.trim();
            const studentID = document.getElementById('studentID').value.trim();
            const emailID = document.getElementById('emailID').value.trim();
            const contactNo = document.getElementById('contactNo').value.trim();

            // Input validation
            if (!validateInput('studentName', studentName)) {
                alert('Please enter a valid student name (characters only).');
                return;
            }
            if (!validateInput('studentID', studentID)) {
                alert('Please enter a valid student ID (numbers only).');
                return;
            }
            if (!validateInput('emailID', emailID)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!validateInput('contactNo', contactNo)) {
                alert('Please enter a valid contact number (numbers only).');
                return;
            }

            // Check for duplicate ID only if it's different from the original student's ID
            const originalID = students[indexToUpdate].id;
            if (studentID !== originalID && students.some(student => student.id === studentID)) {
                alert('A student with this ID already exists.');
                return;
            }

            students[indexToUpdate] = {
                name: studentName,
                id: studentID,
                email: emailID,
                contact: contactNo
            };

            saveStudents(); // Save to local storage
            displayStudents(); // Update table

            // Reset form and button
            studentForm.reset();
            document.getElementById('addStudentBtn').textContent = 'Add Student';
            delete document.getElementById('addStudentBtn').dataset.editingIndex; // Remove data attribute
        }
    });

    // Initial display of students when the page loads
    displayStudents();
});