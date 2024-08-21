This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install node.js dependancies

```bash
npm install
```

Install the following programs:

- [Miniconda](https://docs.anaconda.com/miniconda/miniconda-install/)
- [Python Latest Release](https://www.python.org/downloads/)

Create the rag enviroment using Conda and the installed Python version

```bash
conda create -n rag python
```

Install rag enviroment dependancies

```bash
pip install -r requirements.txt
```

Run the development server:

```bash
conda activate rag
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
