# CharityClick
### ✨ HackGT 9 Best Overall - Emerging ✨

## Inspiration

As typical distracted students, we wanted to build a tool that could solve a problem in our lives. Additionally, we knew we wanted the project we build here today has a positive impact on the world at large.

## What it does

The CharityClick platform, comprised of a website and chrome extension so far, tracks every time you go on a distracting website and makes a small donation to a charity of your choosing. Doing so, we help discourage distractions without impeding the user, leading to them removing the extension.

## How we built it

We used React.js, Node.js, and MongoDB to build a website and Chrome Extension to track the page visits. Whenever it detects distracting web usage, it calls our REST API and handles the payment. We route payments through Stripe and display the information visually to the users.

## Demo

https://youtu.be/c7ZEHynWz_k

---

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
