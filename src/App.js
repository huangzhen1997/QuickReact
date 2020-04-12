import React,{useState, useEffect} from 'react';
import 'rbx/index.css'
import {Button,Container,Title} from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA6tv5CMsoMYnix9FPZ8RFJeI_yY4iRzjg",
  authDomain: "quickreact-5337d.firebaseapp.com",
  databaseURL: "https://quickreact-5337d.firebaseio.com",
  projectId: "quickreact-5337d",
  storageBucket: "quickreact-5337d.appspot.com",
  messagingSenderId: "395861710079",
  appID: "quickreact-5337d",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const Banner = ({title}) => (
<Title>{title||'[loading..]'}</Title>
);

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const hasConflict = (course,selected) => (selected.some(c => courseConflict(c,course)));

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const days = ['M', 'Tu', 'W', 'Th', 'F'];

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: schedule.courses.map(addCourseTimes)
});

const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
  course1 !== course2
  && getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);



const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);


const getCourseNumber = course => (
  course.id.slice(1, 4)
)

const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const {days} = timeParts(meets);
  if (days) saveCourse(course, meets); 
  else moveCourse(course);
};

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
};
  
const Course = ({ course,state }) => (
  <Button color ={buttonColor(state.selected.includes(course))}
    onClick = {()=> state.toggle(course)} 
    onDoubleClick={ () => moveCourse(course) }
    disabled = {hasConflict(course,state.selected)}>
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </Button>
);

const buttonColor = selected => (
  selected ? 'success' : null
);

const TermSelector=({state})=>(
  <Button.Group hasAddons>
    {
      Object.values(terms).map(value=>
      <Button key={value}
       color={buttonColor(value===state.term)}
       onClick={()=>state.setTerm(value)}>
        {value}
      </Button>)
    }
  </Button.Group>
);

const useSelection = () =>{
  const [selected,setSelected] = useState([]);
  const toggle=(x)=>{
    setSelected(selected.includes(x) ? selected.filter( y => y !== x ) : [x].concat(selected))
  };
  return [selected,toggle];
};

const CourseList = ({ courses }) => {
  const [term,setTerm] = useState("Fall");
  const [selected,toggle]=useSelection();
  const termCourses = courses.filter(course=>term === getCourseTerm(course));

  return(
    <React.Fragment>
    <TermSelector state = {{term,setTerm}}/>
    <Button.Group>
      { termCourses.map(course => <Course course={ course } key={course.id} state={{selected,toggle}}/>) }
    </Button.Group>
    </React.Fragment>
  );
};

const App = () => {
  const [schedule, setSchedule] = useState({title:'',courses:[]});
  //const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';
  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);
  return(
    <Container>
      <Banner title = {schedule.title}/>
      <CourseList courses={schedule.courses}/>
    </Container>
  )
};
;

export default App;
