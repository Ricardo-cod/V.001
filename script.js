let currentRoom = '';
const activitiesByRoom = {};
const returnedActivitiesByRoom = {};
const studentNamesByRoom = {};
let isDarkTheme = false;

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    document.getElementById('theme-icon').classList.toggle('fa-sun', !isDarkTheme);
    document.getElementById('theme-icon').classList.toggle('fa-moon', isDarkTheme);
}

function login(role) {
    const name = role === 'student' ? document.getElementById('student-name').value : document.getElementById('teacher-name').value;
    const password = role === 'student' ? document.getElementById('student-password').value : document.getElementById('teacher-password').value;
    const room = role === 'student' ? document.getElementById('student-room').value : document.getElementById('teacher-room').value;
    const errorMessage = document.getElementById(role === 'student' ? 'student-error-message' : 'teacher-error-message');

    if ((role === 'student' && password === '1234') || 
        (role === 'teacher' && password === '2812')) {

        if (role === 'student') {
            if (!studentNamesByRoom[room]) {
                studentNamesByRoom[room] = [];
            }
            studentNamesByRoom[room].push(name);
        }

        document.querySelectorAll('.login').forEach(loginDiv => {
            loginDiv.style.display = 'none';
        });
        document.querySelector('.dashboard').style.display = 'block';
        document.getElementById('welcome-message').innerText = `Bem-vindo!`;
        document.getElementById('user-name-display').innerText = `Logado como: ${name}`;
        currentRoom = room;

        if (role === 'student') {
            document.getElementById('courses-button').style.display = 'block';
            document.getElementById('student-activities-area').style.display = 'block';
            loadActivitiesForStudent(room);
        } else {
            document.getElementById('courses-button').style.display = 'none';
            document.getElementById('teacher-activity-area').style.display = 'block';
            document.getElementById('teacher-returned-activities-area').style.display = 'block';
            loadReturnedActivitiesForTeacher(room);
        }
        
        errorMessage.innerText = '';
    } else {
        errorMessage.innerText = 'Credenciais inválidas.';
    }
}

function loadActivitiesForStudent(room) {
    const activitiesList = document.getElementById('activities-list');
    activitiesList.innerHTML = ''; // Limpar a lista anterior

    if (activitiesByRoom[room]) {
        activitiesByRoom[room].forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity;
            activitiesList.appendChild(li);
        });
    }
}

function loadReturnedActivitiesForTeacher(room) {
    const returnedActivitiesList = document.getElementById('returned-activities-list');
    returnedActivitiesList.innerHTML = ''; // Limpar a lista anterior

    if (returnedActivitiesByRoom[room]) {
        returnedActivitiesByRoom[room].forEach(({ studentName, content, date }) => {
            const li = document.createElement('li');
            li.textContent = `Atividade: "${content}" - De: ${studentName} - Data/Hora: ${date}`;
            returnedActivitiesList.appendChild(li);
        });
    }
}

function sendActivity() {
    const activityContent = document.getElementById('activity-content').value;
    const activityMessage = document.getElementById('activity-message');

    if (activityContent.trim() === '') {
        activityMessage.innerText = 'Por favor, digite uma atividade antes de enviar.';
        activityMessage.style.color = 'red';
        return;
    }

    if (!activitiesByRoom[currentRoom]) {
        activitiesByRoom[currentRoom] = [];
    }
    activitiesByRoom[currentRoom].push(activityContent);

    activityMessage.innerText = 'Atividade enviada com sucesso!';
    activityMessage.style.color = 'green';
    document.getElementById('activity-content').value = ''; // Limpar o campo de texto
    loadActivitiesForStudent(currentRoom); // Atualizar a lista de atividades recebidas
    notifyStudents(currentRoom, activityContent); // Notificar os alunos
}

function notifyStudents(room, activityContent) {
    const studentNames = studentNamesByRoom[room] || [];
    studentNames.forEach(student => {
        const li = document.createElement('li');
        li.textContent = `Nova atividade: "${activityContent}"`;
        document.getElementById('activities-list').appendChild(li);
    });
}

function returnActivity() {
    const studentName = document.getElementById('student-name').value; // Pegar o nome do aluno logado
    const returnedActivityContent = document.getElementById('student-response-content').value;
    const returnedActivityMessage = document.getElementById('returned-activity-message');

    if (returnedActivityContent.trim() === '') {
        returnedActivityMessage.innerText = 'Por favor, digite uma resposta antes de enviar.';
        returnedActivityMessage.style.color = 'red';
        return;
    }

    if (!returnedActivitiesByRoom[currentRoom]) {
        returnedActivitiesByRoom[currentRoom] = [];
    }
    
    const date = new Date().toLocaleString(); // Pega a data e hora atual
    returnedActivitiesByRoom[currentRoom].push({
        studentName: studentName,
        content: returnedActivityContent,
        date: date
    });

    returnedActivityMessage.innerText = 'Atividade enviada com sucesso!';
    returnedActivityMessage.style.color = 'green';
    document.getElementById('student-response-content').value = ''; // Limpar o campo de texto
    loadReturnedActivitiesForTeacher(currentRoom); // Atualizar a lista de atividades devolvidas
}

function logout() {
    document.querySelectorAll('.login').forEach(loginDiv => {
        loginDiv.style.display = 'block';
    });
    document.querySelector('.dashboard').style.display = 'none';
    document.getElementById('student-name').value = '';
    document.getElementById('student-password').value = '';
    document.getElementById('student-room').value = '';
    document.getElementById('teacher-name').value = '';
    document.getElementById('teacher-password').value = '';
    document.getElementById('teacher-room').value = '';
    document.getElementById('user-name-display').innerText = '';
    document.getElementById('courses-button').style.display = 'none'; // Esconder o botão ao sair
    document.getElementById('teacher-activity-area').style.display = 'none'; // Esconder a área de envio de atividades ao sair
}

function openFloatingWindow() {
    const floatingWindow = window.open("https://eugene6869.hocoos.com", "Cursos LogTech", "width=280,height=70,top=100,left=100");
    floatingWindow.focus();
}
