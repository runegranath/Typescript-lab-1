import "./style.css";

interface CourseInfo {
  code: string;
  name: string;
  progression: "A" | "B" | "C";
  syllabus: string;
}

function getCourses(): CourseInfo[] {
  const data = localStorage.getItem("courses");

  if (data !== null) {
    return JSON.parse(data);
  } else {
    return [];
  }
}

const myCourses: CourseInfo[] = getCourses();
console.log(myCourses);

function displayCourses(courses: CourseInfo[]): void {
  const tableBody = document.getElementById(
    "courseBody",
  ) as HTMLTableSectionElement;
  if (!tableBody) return;

  tableBody.innerHTML = "";

  courses.forEach((course, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.progression}</td>
            <td><a href="${course.syllabus}" target="_blank">Länk</a></td>
            <td></td> 
        `;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Radera";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      removeCourse(index);
    });

    row.querySelector("td:last-child")?.appendChild(deleteBtn);
    tableBody.appendChild(row);
  });
}

function removeCourse(index: number): void {
  let allCourses: CourseInfo[] = getCourses();

  allCourses.splice(index, 1);

  const jsonString: string = JSON.stringify(allCourses);

  localStorage.setItem("courses", jsonString);

  displayCourses(allCourses);
}

const courseForm: HTMLFormElement | null = document.getElementById(
  "courseForm",
) as HTMLFormElement;

courseForm.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  const codeInput = document.getElementById("courseCode") as HTMLInputElement;
  const nameInput = document.getElementById("courseName") as HTMLInputElement;
  const progressionInput = document.getElementById(
    "courseProgression",
  ) as HTMLSelectElement;
  const syllabusInput = document.getElementById(
    "courseSyllabus",
  ) as HTMLInputElement;

  const newCourse: CourseInfo = {
    code: codeInput.value,
    name: nameInput.value,
    progression: progressionInput.value as "A" | "B" | "C",
    syllabus: syllabusInput.value,
  };

  if (isCodeUnique(newCourse.code)) {
    addNewCourse(newCourse);
    courseForm.reset();
  } else {
    alert("Kurskoden måste vara unik!");
  }
});

function isCodeUnique(code: string): boolean {
  const allCourses = getCourses();
  const exists = allCourses.some((course) => course.code === code);
  return !exists;
}

function addNewCourse(course: CourseInfo): void {
  const allCourses = getCourses();

  allCourses.push(course);

  localStorage.setItem("courses", JSON.stringify(allCourses));

  displayCourses(allCourses);
}

displayCourses(myCourses);
