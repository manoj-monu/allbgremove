import { redirect } from 'next/navigation';

export default function Blog() {
  redirect('/index.html#how-it-works');
}
