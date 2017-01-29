
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
    key: 'python', 
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
    key: 'php', 
    label: 'PHP', 
    lang: 'php', 
    env: Env.FLEXIBLE
  },
  { 
    key: 'go', 
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
    key: 'python-standard', 
    label: 'Python (standard)', 
    lang: 'python', 
    env: Env.STANDARD
  },
  { 
    key: 'go-standard', 
    label: 'Go (standard)', 
    lang: 'go', 
    env: Env.STANDARD
  },
  { 
    key: 'php-standard', 
    label: 'PHP (standard)', 
    lang: 'php', 
    env: Env.STANDARD
  }
];