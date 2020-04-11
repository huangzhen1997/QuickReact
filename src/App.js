import React,{useState, useEffect} from 'react';
import 'rbx/index.css'
import {Button,Container,Title} from 'rbx';

const Banner = ({title}) => (
<Title>{title||'[loading..]'}</Title>
);

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
)
  
const Course = ({ course }) => (
  <button>
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </button>
);
  
const CourseList = ({ courses }) => (
  <Button.Group>
    { courses.map(course => <Course course={ course } />) }
  </Button.Group>
);

const App = () => {
  const [schedule, setSchedule] = useState({title:'',courses:[]});
  const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';
  useEffect(() =>{ const fetchSchedule = async() => {
    const response = await fetch(url);
    if(!response.ok) throw response;
    const json = await response.json();
    setSchedule(json);
  }
  fetchSchedule();
},[])
  return(
    <Container>
      <Banner title = {schedule.title}/>
      <CourseList courses={schedule.courses}/>
    </Container>
  )
};
;

export default App;
