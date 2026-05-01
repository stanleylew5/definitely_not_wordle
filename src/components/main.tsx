/* async function getWordle(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);

  const res = await fetch(
    `https://jindrich-bar--nyt-games-api.apify.actor/wordle/${today}?token=${process.env.APIFY_TOKEN}`,
  );

  const data = await res.json();
  return data.word;
} */

const Main = async () => {
  const word = "test";

  return <div>Testing</div>;
};

export default Main;
