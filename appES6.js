class Lesson {
  constructor(title, instructor, image) {
    this.coursesId = Math.floor(Math.random() * 10000);
    this.title = title;
    this.instructor = instructor;
    this.image = image;
  }
}

class UI {
  addToLesson(lessons) {
    const list = document.querySelector("#course-list");

    let html = `
    <tr>
    <td><img src="img/${lessons.image}"/class="images"></td>
    <td>${lessons.title}</td>
    <td>${lessons.instructor}</td>
    <td><a href="#" data-id="${lessons.coursesId}" class="btn btn-danger btn-sm delete">Delete</a></td>
    </tr>
    `;

    list.innerHTML += html;
  }
  deleteLessons(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }
  showAlert(message, className) {
    let alertHtml = `
  <div class="alert alert-${className}">
  ${message}
  </div>
  `;

    const row = document.querySelector(".row");

    row.insertAdjacentHTML("beforeBegin", alertHtml);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
}

class LocaleStorage {
  // burdan bilgi alacak
  static getLessons() {
    let lessons;

    if (localStorage.getItem("lessons") === null) {
      lessons = [];
    } else {
      lessons = JSON.parse(localStorage.getItem("lessons"));
    }

    return lessons;
  }

  // yukardan aldığı bilgiyi göstercek
  static showLessons() {
    const lessons = LocaleStorage.getLessons();

    lessons.forEach((courses) => {
      const ui = new UI();
      ui.addToLesson(courses);
    });
  }

  static addLesson(courses) {
    const lessons = LocaleStorage.getLessons();
    lessons.push(courses);
    localStorage.setItem("lessons", JSON.stringify(lessons));
  }

  static deleteLesson(element) {
    if (element.classList.contains("delete")) {
      const id = element.getAttribute("data-id");
      const lessons = LocaleStorage.getLessons();

      lessons.forEach((course, index) => {
        if (course.coursesId == id) {
          lessons.splice(index, 1);
        }
      });

      localStorage.setItem("lessons", JSON.stringify(lessons));
    }
  }
}

document.addEventListener("DOMContentLoaded", LocaleStorage.showLessons);

document
  .querySelector("#new-course")
  .addEventListener("submit", function (event) {
    const title = document.getElementById("title").value;
    const instructor = document.getElementById("instructor").value;
    const image = document.getElementById("image").value;

    const courses = new Lesson(title, instructor, image);

    const ui = new UI();
    if (!title.trim() || !instructor.trim() || !image.trim()) {
      ui.showAlert("Form invalid", "warning");
    } else {
      ui.addToLesson(courses);

      // save to LC

      LocaleStorage.addLesson(courses);
      ui.showAlert("the course has been added", "success");
    }
    event.preventDefault();
  });

document
  .querySelector("#course-list")
  .addEventListener("click", function (event) {
    const ui = new UI();
    ui.deleteLessons(event.target);
    // delete from Lc
    LocaleStorage.deleteLesson(event.target);
    ui.showAlert("the lesson has been deleted", "danger");
  });
