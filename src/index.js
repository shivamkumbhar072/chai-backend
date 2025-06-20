 import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('vercel working');
});

app.get('/api/jokes', (req, res) => {
const jokes = [
  {
    id: 1,
    title: "Why don't scientists trust atoms?",
    joke: "Because they make up everything!"
  },
  {
    id: 2,
    title: "Why did the bicycle fall over?",
    joke: "Because it was two-tired!"
  },
  {
    id: 3,
    title: "Parallel lines have so much in common...",
    joke: "It’s a shame they’ll never meet."
  },
  {
    id: 4,
    title: "What do you call fake spaghetti?",
    joke: "An impasta!"
  },
  {
    id: 5,
    title: "Why can’t your nose be 12 inches long?",
    joke: "Because then it would be a foot!"
  },
  {
    id: 6,
    title: "Why did the scarecrow win an award?",
    joke: "Because he was outstanding in his field!"
  },
  {
    id: 7,
    title: "What do you call cheese that isn’t yours?",
    joke: "Nacho cheese!"
  },
  {
    id: 8,
    title: "How does a penguin build its house?",
    joke: "Igloos it together!"
  },
  {
    id: 9,
    title: "Why don’t skeletons fight each other?",
    joke: "They don’t have the guts."
  },
  {
    id: 10,
    title: "What did one ocean say to the other ocean?",
    joke: "Nothing, they just waved."
  }
];
  res.send(jokes)
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
