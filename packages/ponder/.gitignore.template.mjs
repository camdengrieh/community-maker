const contents = () =>
    `# Dependencies
/node_modules

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Misc
.DS_Store

# Env files
.env*.local

# Ponder
/generated/
/.ponder/`;

export default contents;