import { redirect } from 'next/navigation';

/** Legacy Slim landing — permanently moved to catalog PDP. */
export default function SlimPageRedirect() {
  redirect('/shop/nutrition-28-day');
}
