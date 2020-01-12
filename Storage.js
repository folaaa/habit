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
