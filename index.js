const inquirer = require('inquirer');
const fs = require('fs');
const css = require('./Develop/style');

const Employee = require('./Develop/employee');
const Engineer = require('./Develop/engineer');
const Intern = require('./Develop/intern');
const Manager = require('./Develop/manager');


let myTeam = [];


const startTeam = () => {
    inquirer.prompt ([
        {   
            type: 'input',
            message:'Welcome! Please enter your team name',
            name:'teamname'
        }
    ])

    .then ((data) => {
        const team = data.teamname;
        myTeam.push(team);
        addManager();
    });
}

const addManager = () => {
   return inquirer.prompt([
        {   
            type: 'input',
            message: 'Who is your manager for this team?',
            name: 'name'
        },
        {   
            type: 'input',
            message: "What is your team manager's email address? ",
            name: 'email'
        },
        {
            type: 'number',
            message: "What is your team manager's office number?",
            name: 'officeNumber'
        },
    ])

    .then((data) => {
       
        const name = data.name;
        const id = 1;
        const email = data.email;
        const officeNumber = data.officeNumber;
        const teamManager = new Manager(name, id, email, officeNumber);
        myTeam.push(teamManager);
        addTeamMember();
        console.log(officeNumber);
    });
}

const addTeamMember = () => {
    return inquirer.prompt([
        {
           type: 'list',
           message: 'Would you like to add more members to your team?',
           choices: ['Please add an engineer', 'Please add an intern', 'No thank you, I have all my team members'],
           name: 'addMember' 
        }
    ])

    .then ((data) => {
        console.log(data.addMember)
        switch (data.addMember){
            case 'Please add an engineer':
                addEngineer();
                break;

            case 'Please add an intern':
                addIntern();
                break;
                
            case 'No thank you, I have all my team members':
                compileTeam();
                break;  
                
               
        }
    });
}


const addEngineer = () => {
    console.log('not working anymore')
    return inquirer.prompt([
        {   
            type: 'input',
            message: "What is your engineer's name?",
            name: 'name'
        },
        {
            
            type: 'input',
            message: "What is your engineer's email address?",
            name: 'email'
        },
        {

            type: 'input',
            message: "What is your engineer's GitHub profile name?",
            name: 'github'
        }
    ])

    .then ((data) => {
      
        const name = data.name;
        const id = myTeam.length + 1;
        const email = data.email;
        const github = data.github;
        const teamEngineer = new Engineer(name, id, email, github);
        myTeam.push(teamEngineer);
        addTeamMember();
    });
}

const addIntern = () => {
    return inquirer.prompt([
        {
            type: 'input',
            message: "What is your intern's name?",
            name: 'name'
        },
        {

            type: 'input',
            message: "What is your intern's email address?",
            name: 'email'
        },
        {

            type: 'input',
            message: "What is the name of the school that your intern has attended?",
            name: 'school'
        }
    ])
    
    .then ((data) => {
       
        const name = data.name;
        const id = myTeam.length + 1;
        const email = data.email;
        const school = data.school;
        const teamIntern = new Intern (name, id, email, school);
        myTeam.push(teamIntern);
        addTeamMember();
    });
}

const compileTeam = () => {
    console.log('trying to put it together')
    const myPage = [];
    const pageStart = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>The Dream Team</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <script src="https://kit.fontawesome.com/2037253f5c.js" crossorigin="anonymous"></script>
    <style>
    ${css}
    </style>
 
</head>

<body>
    <div class="container-fluid">
        <div class="row" id = 'header'>
            <div class="col-12 jumbotron mb-3 team-heading">
                <h1 class="text-center">${myTeam[0]}</h1>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="team-area col-12 d-flex justify-content-center">
                ${myTeam[0]}
            </div>
        </div>
    </div>`

    myPage.push(pageStart);

    for (let i = 1; i < myTeam.length; i++){
        let teamCards = `
     <div class="card employee-card">
         <div class="card-header" id="engineer">
           <h2 class="card-title">${myTeam[i].name}</h2>
           <h3 class="card-title"><i class="fas fa-user"></i>${myTeam[i].role}</h3>
        </div>
     
       <div class="card-body">
         <ul class="list-group">
             <li class="list-group-item">ID: ${myTeam[i].id}</li>
             <li class="list-group-item">Email: <a href="mailto:{{ email }}">${myTeam[i].email}</a></li>
         `
         if (myTeam[i].officeNumber){
             teamCards += `
              <li class="list-group-item">Office number: ${myTeam[i].officeNumber}</li>`
         }

         if (myTeam[i].github) {
             teamCards += `
             <li class="list-group-item">GitHub: <a href="https://github.com/${myTeam[i].github}" target="_blank" rel="noopener noreferrer">${myTeam[i].github}</a></li>
             `
         }

         if (myTeam[i].school) {
             teamCards +=`
             <li class="list-group-item">School: ${myTeam[i].school}</li>
             `
         }

         myPage.push(teamCards);

 }  
 
 
const endPage = ` 
            </ul>
        </div>
     </div>  
</body>

</html>   
`

    myPage.push(endPage);

    fs.writeFile(`index.html`, myPage.join(''), (err) => {
        if (err){
            console.log(err);
        }else {
            console.log('Success!')
        };
    })
        
};

startTeam();
