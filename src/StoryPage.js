import { html } from "./lib";
import StoryCard from "./components/StoryCard";
import StoryVideoCard from "./components/StoryVideoCard";

const story = `The circumstances that might leat to homelessness can include loss of income or transportation, a falling out with loved ones, or an abrupt economic downturn. For Brandon and Jennifer, it was all of these things.Brandon and Jennifer hadn’t expected their world to collapse so quickly.
Two years ago, they’d been living comfortably in a small, well-kept apartment near Jennifer’s workplace. Brandon had a job he loved, teaching at a local school, and Jennifer worked in a bustling design firm. They had each other, close friends, and enough income to splurge on little luxuries now and then. But when Brandon’s school closed unexpectedly due to budget cuts, the first thread unraveled.
Brandon spent months searching for teaching jobs, but education budgets were tight everywhere, and there were few positions. Their savings dwindled as they held out hope, and Jennifer's income alone became their lifeline. Then one evening, an accident totaled Jennifer’s car, and the nearest bus stop was a fifteen-minute walk from their apartment. They tried to make it work, but each day of icy weather and hours of public transportation started taking a toll on Jennifer’s health and her punctuality at work. Her supervisor grew less sympathetic, and one day, she was called into his office for the last time.
With their incomes gone, Brandon and Jennifer moved to a cheaper part of town, hoping they’d have enough left to get by until something came up. They sold off most of their things, feeling the pain of each item that left—books, clothes, even the couch they’d curled up on for so many Friday movie nights. Despite everything, they kept their spirits high, comforting each other with shared memories and promises of better days.
Then, as if the universe wasn’t finished with them, an economic downturn rippled through the city. Rents rose, food costs soared, and the city grew tense as more and more people found themselves in hard times. The cheap neighborhood they’d moved to became as expensive as the last place, and the money they’d saved after selling their belongings slipped through their fingers.
One morning, when they could no longer make the rent, they packed what was left of their things and left, saying goodbye to the city that had once been their home. They spent a few days in shelters, clutching each other’s hands, their breaths matching like a heartbeat as they lay side by side on narrow cots. Brandon signed up for every food assistance program and job counseling workshop he could find, trying to stay hopeful, though he could feel Jennifer’s worry eating away at her.
One rainy evening, when they had nowhere to go, they found themselves under an overpass near the city park. The space was cold, but the rain couldn’t reach them, and they took shelter with others who’d found themselves in the same position. They huddled together, both scared and comforted by the strangers around them, people who had stories of their own—stories of loss and endings.
In the weeks that followed, they discovered something surprising. Kindness lingered in the smallest of places. The library let them sit in the warmth as they looked for work, a bakery owner gave them bread that hadn’t sold that day, and a retired social worker named Joan, who regularly volunteered at a shelter, took an interest in helping them. Through Joan’s network, Jennifer found a part-time job, and Brandon started volunteering as a tutor, gradually rebuilding the life they’d lost piece by piece.
Life wasn’t the same, but each step forward felt like a victory.`;

const StoryPage = () => {
  const markups = `
        <section class="w-full h-screen flex flex-col-reverse xl:flex-row justify-center items-center gap-10 xl:gap-20 p-4">          
            ${StoryCard({story})}
            ${StoryVideoCard({})}
        </section>
    `;

  return html`${markups}`;
};

export default StoryPage;
