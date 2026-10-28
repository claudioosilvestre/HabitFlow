import { listHabits } from "./components/HabitList";
import { createHabit, getHabits } from "./services/HabitService";
import { habitForm } from "./components/HabitForm";
import { dashboard } from "./components/Dashboard";
import { stats } from "./components/Stats";
import "../styles/style.css";

const app = document.getElementById("app");
if(app === null) {
    throw new Error("Failed to get app.");
}

const nav = document.getElementById("nav");
if(nav === null) {
    throw new Error("Failed to get nav.");
}

nav.addEventListener("click", (event) => {

    event.preventDefault();

    if(event.target instanceof Element) {
        const link = event.target.closest("a[data-page]");

        if(link === null) {
            return;
        }

        const dataPage = link.getAttribute("data-page");
        if(dataPage === null) {
            return;
        }

        nav.querySelectorAll("a[data-page]").forEach(pageLink => pageLink.classList.toggle("active", pageLink === link));
        const currentPage = document.querySelector(".topbar-current");
        if(currentPage) {
            currentPage.textContent = dataPage === "habits" ? "Os meus hábitos" : dataPage === "stats" ? "Estatísticas" : "Dashboard";
        }

        switch(dataPage) {
            case "dashboard":
                dashboard(app);
                break;

            case "habits":
                showHabitsPage(app);
                break;

            case "stats":
                stats(app);
                break;
        }
        
    }
})

dashboard(app);

async function showHabitsPage(element:HTMLElement) {
    element.innerHTML = "";

    const heading = document.createElement("h1");
    heading.textContent = "Os meus hábitos";
    element.appendChild(heading);

    const habitListDiv = document.createElement("div");
    element.appendChild(habitListDiv);

    const habits = await getHabits();

    listHabits(habitListDiv, habits);

    const createButton = document.createElement("button");
    createButton.type = "button";
    createButton.textContent = "Criar Hábito";

    element.appendChild(createButton);

    createButton.addEventListener("click", async (event) => {

        
        habitForm(element, async (habitCreateRequest) => {
                
            try {
                await createHabit(habitCreateRequest);

                const updatedHabits = await getHabits();

                listHabits(habitListDiv, updatedHabits);
            
            } catch(error) {
                if(error instanceof Error) {
                    alert("Failed to create habit. Please try again.");
                }
            }
        }) 
    });
}



