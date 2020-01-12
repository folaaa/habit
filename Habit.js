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
