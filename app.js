document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const form = document.querySelector("form");
    const checkboxArray = form.querySelectorAll(".custom-checkbox");
    const habitContainer = document.querySelector("#habitContainer");
    const emptyInputAlert = form.querySelector("#empty-input-alert");
    const repeatedNameAlert = form.querySelector("#repeated-name-alert");
    const wrongDataTypeAlert = form.querySelector("#wrong-data-type-alert");

const toggleClasses = (element, ...classNames) => {
    // If the class exists, remove it, if not, then add it
    classNames.forEach(className => element.classList.toggle(className));
  };
  const closeAlerts = () => {
    document.querySelectorAll(".alert").forEach(alert => {
      if (alert.classList.contains("alert-show")) {
        toggleClasses(alert, "alert-hide", "alert-show");
      }
    });
  };
  const getProgress = (complete, goal) => {
    return `${(complete / goal) * 100}%`;
  };
  
  const generateId = () => {
    return Math.random()
      .toString(36)
      .substr(2, 16);
  };

class Habit {
    constructor(name, goal, color, id, complete = 0) {
      this.name = name;
      this.goal = goal;
      this.color = color;
      this.id = id;
      this.complete = complete;
    }
    addHabitToPage = () => {
      habitContainer.innerHTML += `
          <div id=${this.id} class="habit-show">
              <h4 class="text-white">${this.name}</h4>
              <div class="d-flex ">
                  <div class="progress">
                      <div class="progress-bar bg-${
                        this.color
                      }" role="progressbar" style="width: ${getProgress(
        this.complete,
        this.goal
      )}" aria-valuenow="25"
                          aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <button type="button" class="btn btn-dark btn-progress"><i class="fas fa-chevron-right"></i></button>
                  <button type="button" class="btn btn-dark btn-delete"><i class="fas fa-times"></i></button>
          
              </div>
              <p class="text-white"><span class ="complete">${
                this.complete
              }</span> / <span class="goal">${this.goal}</span></p>
          </div>
          `;
    };
  }
  class Storage {
    static getDate() {
      let date = JSON.parse(localStorage.getItem("date"));
      if (!date) {
        date = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ).getTime();
        this.updateDate(date);
      }
      return date;
    }
    static updateDate(newDate) {
      localStorage.setItem("date", JSON.stringify(newDate));
    }
    static getHabitList() {
      const habitList = JSON.parse(localStorage.getItem("habitList")) || [
        {
          name: "Learn something new",
          goal: 2,
          color: "success",
          id: "8x7x0jmofan",
          complete: 0
        },
        {
          name: "Exercise",
          goal: 1,
          color: "warning",
          id: "jfmggnomvlb",
          complete: 0
        }
      ];
      return habitList;
    }
    static updatHabitList(newHabitList) {
      localStorage.setItem("habitList", JSON.stringify(newHabitList));
    }
  
    static addHabit(habit) {
      const habitList = this.getHabitList();
      habitList.push(habit);
      this.updatHabitList(habitList);
    }
    static removeHabit(id) {
      const habitList = this.getHabitList();
      habitList.forEach((habit, index) => {
        if (habit.id == id) {
          habitList.splice(index, 1);
        }
      });
      this.updatHabitList(habitList);
    }
    static updateHabit(habit, complete) {
      const habitList = this.getHabitList();
      habitList.forEach((item, index) => {
        if (item.name === habit.name) {
          habit.complete = complete;
          habitList.splice(index, 1, habit);
        }
      });
      this.updatHabitList(habitList);
    }
    static resetComplete() {
      const habitList = this.getHabitList();
      habitList.forEach((habit, index) => {
        habit.complete = 0;
        habitList.splice(index, 1, habit);
      });
      this.updatHabitList(habitList);
    }
  }
  class HabitList {
    constructor() {
      this.arrayOfObjects = [];
    }
    add = habit => {
      habit.addHabitToPage();
      this.arrayOfObjects.push(habit);
    };
    remove = habit => {
      this.arrayOfObjects.forEach((object, index) => {
        if (object === habit) {
          this.arrayOfObjects.splice(index, 1);
        }
      });
    };
    addStoredHabitsToPage = () => {
      const storedHabitList = Storage.getHabitList();
      if (storedHabitList) {
        storedHabitList.forEach(object => {
          const habit = new Habit(...Object.values(object));
          this.add(habit);
        });
      }
    };
  }
  const date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ).getTime();
  // Check if the date is different than in the local storage
  if (date !== Storage.getDate()) {
    // Update date in the local storage
    Storage.updateDate(date);
    // Set the complete parameter to 0 for every habit in the local storage
    Storage.resetComplete();
  }
  // create HabitList class instance
  const habitList = new HabitList();
  // Display all habits thst are in the local storage
  habitList.addStoredHabitsToPage();

  form.querySelector(".colorPicker").addEventListener("change", e => {
    // Uncheck the checkbox that is currently checked
    for (let checkbox of checkboxArray) {
      const checkboxInput = checkbox.firstElementChild;
      if (checkboxInput.checked) {
        checkboxInput.checked = "";
      }
    }
    // Check the clicked checkbox
    e.target.checked = "checked";
  });

  form.addEventListener("submit", e => {
    // DOM Elements
    const name = document.querySelector("#name").value;
    const goal = document.querySelector("#goal").value;
    // Convert checkboxDivArray from an array-like-object into an array, find the checked checkbox div and then get its id
    const [checkboxDiv] = [].slice
      .call(checkboxArray)
      .filter(checkbox => checkbox.children[0].checked);
    const color = checkboxDiv.id;
    // Prevent the form from submitting
    e.preventDefault();

    // Close alerts that were displayed after previous submit
    closeAlerts();

    let allowSubmit = true;
    // Check if there are any fields that were left blank
    if (name === "" || goal === "") {
      toggleClasses(emptyInputAlert, "alert-hide", "alert-show");
      allowSubmit = false;
      // Check if a habit with the same name already exists
    }
    if (
      !habitList.arrayOfObjects.every(
        habit => habit.name.toLowerCase() !== name.toLowerCase()
      )
    ) {
      toggleClasses(repeatedNameAlert, "alert-hide", "alert-show");
      allowSubmit = false;
      // Check if goal is an integer
    }
    if (!parseInt(goal) && goal !== "") {
      toggleClasses(wrongDataTypeAlert, "alert-hide", "alert-show");
      allowSubmit = false;
    }
    if (allowSubmit) {
      // Close modal
      $("#formModal").modal("hide");

      // Create a habit
      const habit = new Habit(name, parseInt(goal), color, generateId());
      habitList.add(habit);
      Storage.addHabit(habit);
    }
  });

  // When the hide instance method has been called on create habit modal
  $("#formModal").on("hide.bs.modal", function(e) {
    // Close displayed alerts
    closeAlerts();
    // Set form inputs to empty strings
    document.querySelector("#name").value = "";
    document.querySelector("#goal").value = "";
  });

  habitContainer.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "I") {
      // DOM Elements
      const button =
        e.target.tagName === "BUTTON" ? e.target : e.target.parentNode;
      const div = button.parentNode.parentNode;
      const progressBar = div.children[1].firstElementChild.firstElementChild;

      // Get the chosen habit
      const habit = habitList.arrayOfObjects.find(obj => obj.id === div.id);
      // Object destructuring
      const { goal, id } = habit;
      let { complete } = habit;
      // Check if the progress button was clicked
      if (button.classList.contains("btn-progress")) {
        // Add progress
        complete += 1;
        Storage.updateHabit(habit, complete);
        toggleClasses(
          progressBar,
          "progress-bar-striped",
          "progress-bar-animated"
        );
        setTimeout(() => {
          toggleClasses(
            progressBar,
            "progress-bar-striped",
            "progress-bar-animated"
          );
        }, 800);
        progressBar.style.width = getProgress(complete, goal);
        div.lastElementChild.firstElementChild.textContent = complete;

        // Check if the remove button was clicked
      } else if (button.classList.contains("btn-delete")) {
        // Open modal to confirm deletion
        $("#deleteHabitModal").modal("show");
        // Delete habit once deletion is confirmed
        document.querySelector("#btn-delete").addEventListener("click", () => {
          $("#deleteHabitModal").modal("hide");
          // Animate
          div.classList.add("habit-scaleDown");
          // Remove from Storage, habitList and then after 0.5s from DOM
          Storage.removeHabit(id);
          habitList.remove(habit);
          setTimeout(() => {
            div.remove();
          }, 500);
        });
      }
    }
  });
});