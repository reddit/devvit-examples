import { trpc } from './trpc';

const counterValueElement = document.getElementById('counter-value') as HTMLSpanElement;
const incrementButton = document.getElementById('increment-button') as HTMLButtonElement;
const decrementButton = document.getElementById('decrement-button') as HTMLButtonElement;

let currentPostId: string | null = null;

/**
 * Fetches the initial Redis counter state and application context from the backend on load.
 * Displays the counter value and stores the current post context ID.
 */
async function fetchInitialCount() {
  try {
    const [count, { postId }] = await Promise.all([
      trpc.counter.get.query(),
      trpc.init.query(),
    ]);

    counterValueElement.textContent = count.toString();
    if (postId) {
      currentPostId = postId;
    }
  } catch (error) {
    console.error('Failed to load initial count:', error);
  }
}

/**
 * Sends a mutation to the backend to increment or decrement the counter.
 * Only fires if the initial context setup was completed successfully.
 */
async function updateCounter(action: 'increment' | 'decrement') {
  if (!currentPostId) {
    console.error('Cannot update counter: postId is not initialized.');
    return;
  }

  try {
    if (action === 'increment') {
      const increment = await trpc.counter.increment.mutate({ amount: 2 });
      counterValueElement.textContent = increment.toString();
    } else {
      const decrement = await trpc.counter.decrement.mutate({ amount: -2 });
      counterValueElement.textContent = decrement.toString();
    }
  } catch (error) {
    console.error(`Failed to execute ${action} mutation:`, error);
  }
}

incrementButton.addEventListener('click', () => updateCounter('increment'));
decrementButton.addEventListener('click', () => updateCounter('decrement'));

fetchInitialCount();
