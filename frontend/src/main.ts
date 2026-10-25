import { listHabits } from "./components/HabitList";
import { getHabits } from "./services/HabitService";

const app = document.getElementById("app");
if(app === null) {
    throw new Error("Failed to get app.");
}

const habits = await getHabits();

listHabits(app, habits);