
export const Env = {
  STANDARD: "standard",
  FLEXIBLE: "flexible"
}

export const Runtimes = [
  { 
    key: 'nodejs', 
    lang: 'nodejs', 
    label: 'Node.js', 
    env: Env.FLEXIBLE
  },
  { 
    key: 'python-flexible', 
    lang: 'python', 
    label: 'Python', 
    env: Env.FLEXIBLE
  },
  { 
    key: 'ruby', 
    label: 'Ruby', 
    lang: 'ruby', 
    env: Env.FLEXIBLE
  },
  { 
    key: 'php-flexible', 
    label: 'PHP', 
    lang: 'php', 
    env: Env.FLEXIBLE
  },
  { 
    key: 'go-flexible', 
    label: 'Go', 
    lang: 'go', 
    env: Env.FLEXIBLE
  },
  { 
    key: 'dart', 
    label: 'Dart', 
    lang: 'dart', 
    env: Env.FLEXIBLE
  },
  { 
    key: 'python',
    label: 'Python (standard)', 
    lang: 'python', 
    env: Env.STANDARD
  },
  { 
    key: 'go', 
    label: 'Go (standard)', 
    lang: 'go', 
    env: Env.STANDARD
  },
  { 
    key: 'php',
    label: 'PHP (standard)',
    lang: 'php',
    env: Env.STANDARD
  }
];