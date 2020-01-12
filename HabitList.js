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
